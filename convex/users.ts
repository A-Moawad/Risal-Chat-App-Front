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
      conversations: [],
      friends: [],
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

export const getIdByExternalId = query(
  async ({ db }, { externalId }: { externalId: string }) => {
    // Query the database to find the user by externalId
    const user = await db
      .query("users")
      .filter((q) => q.eq(q.field("externalId"), externalId))
      .first();

    if (!user) {
      throw new Error(`User with externalId "${externalId}" not found.`);
    }

    return user._id; // Return the user's Convex ID
  }
);

// get profile image
// export const getProfileImage = query({
//   args: {storageId: v.id("_storage"),},
//   handler: async (ctx, { storageId }) => {
//     const url = await ctx.storage.getUrl(storageId);
//     return url;
//     // const currentUser = await getCurrentUserOrThrow(ctx);
//     // return currentUser.avatarUrl;
//   },
// });

export const updateProfileImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    await ctx.db.patch(currentUser._id, { avatarUrl: args.storageId });

    return { success: true };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const uploadUrl = await ctx.storage.generateUploadUrl();
  return uploadUrl;
});

// get profile image
export const getProfileImage = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = getCurrentUserOrThrow(ctx);
    const userId = (await currentUser)._id;
    const user = await ctx.db.get(userId);
    console.log("user", user);
    console.log("UserId: " + userId);
    if (!user?.avatarUrl) {
      return null;
    }
    const url = await ctx.storage.getUrl(user.avatarUrl);
    return url
  },
}); 
  
export const getUserProfileImage = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);

    if (!user) {
      console.warn(`User with ID ${userId} not found.`);
      return null;
    }

    // Check if the user has an avatar URL
    if (!user.avatarUrl) {
      console.info(`User ${userId} has no avatar URL.`);
      return null;
    }

    // Generate a public URL for the avatar
    try {
      const url = await ctx.storage.getUrl(user.avatarUrl);
      return url;
    } catch (error) {
      console.error(`Failed to fetch avatar URL for user ${userId}:`, error);
      return null;
    }
  },
});


// add friend
export const addFriend = mutation({
  args: { friendEmail: v.string() },
  async handler(ctx, { friendEmail }) {
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
        return friend || null;
      })
    );

    // Filter out any null values for deleted or missing friends
    return friends.filter((friend) => friend !== null);
  },
});

// get friend by id
export const getFriend = query({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const friend = await ctx.db.get(friendId);
    return friend || null;
  },
});
