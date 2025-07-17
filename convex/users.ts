import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, {
      name: args.name,
    });

    return { success: true };
  },
});

// Set user name at registration (required)
export const setNameAtRegistration = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    if (!args.name || args.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    await ctx.db.patch(userId, {
      name: args.name.trim(),
    });
    return { success: true };
  },
});
