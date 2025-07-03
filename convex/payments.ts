import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Record a payment between group members
export const recordPayment = mutation({
  args: {
    groupId: v.id("groups"),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    amount: v.number(), // in cents
    description: v.optional(v.string()),
    date: v.number(),
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
      throw new Error("Not authorized to record payments for this group");
    }

    // Verify both users are members of the group
    const fromMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", args.fromUserId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    const toMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", args.groupId).eq("userId", args.toUserId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    if (!fromMembership || !toMembership) {
      throw new Error("Both users must be members of the group");
    }

    if (args.fromUserId === args.toUserId) {
      throw new Error("Cannot record payment to yourself");
    }

    if (args.amount <= 0) {
      throw new Error("Payment amount must be positive");
    }

    const paymentId = await ctx.db.insert("payments", {
      groupId: args.groupId,
      fromUserId: args.fromUserId,
      toUserId: args.toUserId,
      amount: args.amount,
      description: args.description,
      date: args.date,
      createdAt: Date.now(),
      createdBy: userId,
    });

    return paymentId;
  },
});

// Get payments for a group
export const getGroupPayments = query({
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
      throw new Error("Not authorized to view payments for this group");
    }

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_group_and_date", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .collect();

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const fromUser = await ctx.db.get(payment.fromUserId);
        const toUser = await ctx.db.get(payment.toUserId);
        const creator = await ctx.db.get(payment.createdBy);
        
        return {
          ...payment,
          fromUserName: fromUser?.name || fromUser?.email || "Unknown",
          toUserName: toUser?.name || toUser?.email || "Unknown",
          creatorName: creator?.name || creator?.email || "Unknown",
        };
      })
    );

    return paymentsWithDetails;
  },
});

// Get suggested settlements for a group (who should pay whom)
export const getSuggestedSettlements = query({
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
      throw new Error("Not authorized to view settlements for this group");
    }

    // Get all accepted members
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const memberCount = memberships.length;
    
    // Get all expenses
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    // Get all payments
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    // Calculate net balances
    const balances = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        
        const totalPaid = expenses
          .filter(expense => expense.paidBy === membership.userId)
          .reduce((sum, expense) => sum + expense.amount, 0);

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const shareOfExpenses = Math.round(totalExpenses / memberCount);

        const paymentsMade = payments
          .filter(payment => payment.fromUserId === membership.userId)
          .reduce((sum, payment) => sum + payment.amount, 0);

        const paymentsReceived = payments
          .filter(payment => payment.toUserId === membership.userId)
          .reduce((sum, payment) => sum + payment.amount, 0);

        const netBalance = (totalPaid - shareOfExpenses) + (paymentsReceived - paymentsMade);

        return {
          userId: membership.userId,
          name: user?.name || user?.email || "Unknown",
          netBalance,
        };
      })
    );

    // Separate debtors and creditors
    const debtors = balances.filter(b => b.netBalance < -1).map(b => ({ ...b, amount: -b.netBalance }));
    const creditors = balances.filter(b => b.netBalance > 1).map(b => ({ ...b, amount: b.netBalance }));

    // Generate settlement suggestions using a simple greedy algorithm
    const settlements = [];
    let debtorsCopy = [...debtors];
    let creditorsCopy = [...creditors];

    while (debtorsCopy.length > 0 && creditorsCopy.length > 0) {
      const debtor = debtorsCopy[0];
      const creditor = creditorsCopy[0];

      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.name,
        toUserId: creditor.userId,
        toUserName: creditor.name,
        amount: settlementAmount,
      });

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount <= 1) {
        debtorsCopy.shift();
      }
      if (creditor.amount <= 1) {
        creditorsCopy.shift();
      }
    }

    return settlements;
  },
});
