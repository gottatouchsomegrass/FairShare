import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Add expense to group
export const addExpense = mutation({
  args: {
    groupId: v.id("groups"),
    description: v.string(),
    amount: v.number(), // in cents
    paidBy: v.id("users"),
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
      throw new Error("Not authorized to add expenses to this group");
    }

    // Verify paidBy user is also a member
    const payerMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.paidBy)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    if (!payerMembership) {
      throw new Error("Payer is not a member of this group");
    }

    const expenseId = await ctx.db.insert("expenses", {
      groupId: args.groupId,
      description: args.description,
      amount: args.amount,
      paidBy: args.paidBy,
      date: args.date,
      createdAt: Date.now(),
      createdBy: userId,
    });

    return expenseId;
  },
});

// Get expenses for a group
export const getGroupExpenses = query({
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
      throw new Error("Not authorized to view expenses for this group");
    }

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group_and_date", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .collect();

    const expensesWithDetails = await Promise.all(
      expenses.map(async (expense) => {
        const payer = await ctx.db.get(expense.paidBy);
        const creator = await ctx.db.get(expense.createdBy);

        return {
          ...expense,
          payerName: payer?.name || payer?.email || "Unknown",
          creatorName: creator?.name || creator?.email || "Unknown",
        };
      })
    );

    return expensesWithDetails;
  },
});

// Calculate balances for group members
export const getGroupBalances = query({
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
      throw new Error("Not authorized to view balances for this group");
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

    // Calculate balances for each member
    const balances = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);

        // Calculate total paid by this user
        const totalPaid = expenses
          .filter((expense) => expense.paidBy === membership.userId)
          .reduce((sum, expense) => sum + expense.amount, 0);

        // Calculate total share of all expenses
        const totalExpenses = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const shareOfExpenses = Math.round(totalExpenses / memberCount);

        // Calculate payments made by this user
        const paymentsMade = payments
          .filter((payment) => payment.fromUserId === membership.userId)
          .reduce((sum, payment) => sum + payment.amount, 0);

        // Calculate payments received by this user
        const paymentsReceived = payments
          .filter((payment) => payment.toUserId === membership.userId)
          .reduce((sum, payment) => sum + payment.amount, 0);

        // Net balance = (total paid - share of expenses) + (payments made - payments received)
        const netBalance =
          totalPaid - shareOfExpenses + (paymentsMade - paymentsReceived);

        return {
          userId: membership.userId,
          name: user?.name || user?.email || "Unknown",
          email: user?.email,
          totalPaid,
          shareOfExpenses,
          paymentsMade,
          paymentsReceived,
          netBalance, // positive means they are owed money, negative means they owe money
        };
      })
    );

    return balances;
  },
});
