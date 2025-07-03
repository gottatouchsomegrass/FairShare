import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new group
export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      createdBy: userId,
      createdAt: Date.now(),
    });

    // Add creator as accepted member
    await ctx.db.insert("groupMembers", {
      groupId,
      userId,
      status: "accepted",
      invitedBy: userId,
      invitedAt: Date.now(),
      respondedAt: Date.now(),
    });

    return groupId;
  },
});

// Update group details
export const updateGroup = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Check if user is the creator or a member
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    if (!membership) {
      throw new Error("Not authorized to update this group");
    }

    await ctx.db.patch(args.groupId, {
      name: args.name,
      description: args.description,
    });

    return { success: true };
  },
});

// Delete group (only creator can delete)
export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Only creator can delete
    if (group.createdBy !== userId) {
      throw new Error("Only the group creator can delete the group");
    }

    // Delete all related data
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    // Delete all memberships
    for (const membership of memberships) {
      await ctx.db.delete(membership._id);
    }

    // Delete all expenses
    for (const expense of expenses) {
      await ctx.db.delete(expense._id);
    }

    // Delete all payments
    for (const payment of payments) {
      await ctx.db.delete(payment._id);
    }

    // Finally delete the group
    await ctx.db.delete(args.groupId);

    return { success: true };
  },
});

// Remove member from group
export const removeMember = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Check if current user is the creator or removing themselves
    if (group.createdBy !== currentUserId && args.userId !== currentUserId) {
      throw new Error("Only the group creator can remove other members");
    }

    // Cannot remove the group creator
    if (args.userId === group.createdBy) {
      throw new Error("Cannot remove the group creator");
    }

    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .first();

    if (!membership) {
      throw new Error("User is not a member of this group");
    }

    await ctx.db.delete(membership._id);

    return { success: true };
  },
});

// Get user's groups
export const getUserGroups = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const groups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId);
        if (!group) return null;
        
        const creator = await ctx.db.get(group.createdBy);
        return {
          ...group,
          creatorName: creator?.name || creator?.email || "Unknown",
        };
      })
    );

    return groups.filter((group): group is NonNullable<typeof group> => group !== null);
  },
});

// Get group details with members
export const getGroupDetails = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a member
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    if (!membership) {
      throw new Error("Not authorized to view this group");
    }

    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Get all accepted members
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return {
          userId: membership.userId,
          name: user?.name || user?.email || "Unknown",
          email: user?.email,
          joinedAt: membership.respondedAt,
        };
      })
    );

    return {
      ...group,
      members,
    };
  },
});

// Invite user to group
export const inviteToGroup = mutation({
  args: {
    groupId: v.id("groups"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a member of the group
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    if (!membership) {
      throw new Error("Not authorized to invite to this group");
    }

    // Find user by email
    const invitee = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!invitee) {
      throw new Error("User not found");
    }

    // Check if already invited/member
    const existingMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", invitee._id)
      )
      .first();

    if (existingMembership) {
      if (existingMembership.status === "accepted") {
        throw new Error("User is already a member");
      } else if (existingMembership.status === "pending") {
        throw new Error("User already has a pending invitation");
      }
    }

    // Create invitation
    await ctx.db.insert("groupMembers", {
      groupId: args.groupId,
      userId: invitee._id,
      status: "pending",
      invitedBy: userId,
      invitedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get pending invitations for user
export const getPendingInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const invitations = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_status", (q) => 
        q.eq("userId", userId).eq("status", "pending")
      )
      .collect();

    const invitationsWithDetails = await Promise.all(
      invitations.map(async (invitation) => {
        const group = await ctx.db.get(invitation.groupId);
        const inviter = await ctx.db.get(invitation.invitedBy);
        
        return {
          ...invitation,
          groupName: group?.name || "Unknown Group",
          inviterName: inviter?.name || inviter?.email || "Unknown",
        };
      })
    );

    return invitationsWithDetails;
  },
});

// Respond to group invitation
export const respondToInvitation = mutation({
  args: {
    groupId: v.id("groups"),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const invitation = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (!invitation) {
      throw new Error("No pending invitation found");
    }

    await ctx.db.patch(invitation._id, {
      status: args.accept ? "accepted" : "declined",
      respondedAt: Date.now(),
    });

    return { success: true };
  },
});
