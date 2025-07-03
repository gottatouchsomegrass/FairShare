import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Groups table
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_creator", ["createdBy"]),

  // Group members with invitation status
  groupMembers: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
    invitedBy: v.id("users"),
    invitedAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_group_and_user", ["groupId", "userId"])
    .index("by_user_and_status", ["userId", "status"]),

  // Expenses table
  expenses: defineTable({
    groupId: v.id("groups"),
    description: v.string(),
    amount: v.number(), // in cents to avoid floating point issues
    paidBy: v.id("users"),
    date: v.number(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_group", ["groupId"])
    .index("by_payer", ["paidBy"])
    .index("by_group_and_date", ["groupId", "date"]),

  // Payments/settlements between members
  payments: defineTable({
    groupId: v.id("groups"),
    fromUserId: v.id("users"), // who paid
    toUserId: v.id("users"),   // who received
    amount: v.number(), // in cents
    description: v.optional(v.string()),
    date: v.number(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_group", ["groupId"])
    .index("by_from_user", ["fromUserId"])
    .index("by_to_user", ["toUserId"])
    .index("by_group_and_date", ["groupId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
