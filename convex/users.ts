import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const now = new Date().toISOString();

    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
      email: data.email_addresses[0].email_address,
      createdAt: now,
      updatedAt: now,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

// add friend
export const addFriend = mutation({
  args: { friendEmail: v.string() }, // Accept the friend's email
  async handler(ctx, { friendEmail }) {
    // Get the current user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Find the friend by email
    const friend = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", friendEmail))
      .unique();

    if (!friend) {
      throw new Error(`No user found with email: ${friendEmail}`);
    }

    if (currentUser._id === friend._id) {
      throw new Error("You cannot add yourself as a friend.");
    }

    // Check if the friend is already in the user's friend list
    const isAlreadyFriend = currentUser.friends?.some(
      (friendId) => friendId === friend._id
    );

    if (isAlreadyFriend) {
      throw new Error("This user is already your friend.");
    }

    // Update the current user's friend list
    await ctx.db.patch(currentUser._id, {
      friends: [...(currentUser.friends || []), friend._id],
    });
  },
});

// get friend list
export const getFriendList = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    if (!currentUser.friends || currentUser.friends.length === 0) {
      return []; // No friends to fetch
    }

    // Use Promise.all to fetch all friends concurrently
    const friends = await Promise.all(
      currentUser.friends.map(async (friendId) => {
        const friend = await ctx.db.get(friendId);
        return friend || null; // Handle missing friend gracefully
      })
    );

    // Filter out any null values for deleted or missing friends
    return friends.filter((friend) => friend !== null);
  },
});

