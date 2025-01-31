import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a conversation
export const createConversation = mutation({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (args.user1 === args.user2) {
      throw new Error("Cannot create a conversation with the same user.");
    }

    try {
      const sortedParticipants = [args.user1, args.user2].sort();

      const existingConversation = await ctx.db
        .query("conversations")
        .withIndex("byParticipants", (q) =>
          q.eq("participants", sortedParticipants)
        )
        .first();

      if (existingConversation) {
        return { conversationId: existingConversation._id };
      }

      const conversationId = await ctx.db.insert("conversations", {
        participants: sortedParticipants,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { conversationId };
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw new Error("Failed to create or fetch conversation.");
    }
  },
});

// get one conversation
export const getConversationId = query({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sortedParticipants = [args.user1, args.user2].sort();

    console.log("sorteed participants", sortedParticipants);
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("byParticipants", (q) =>
        q.eq("participants", sortedParticipants)
      )
      .first();

    if (!conversation) {
      console.log(
        "No conversation found for participants:",
        sortedParticipants
      );
      return null;
    }

    return conversation._id;
  },
});

// export const getUserConversationId = () => {
//   args: {
//     user1: v.id("users"),
//     user2: v.id("users"),
//   },
// }

// get uer conversations
// export const getCurrentUserConversations = query({
//   args: {
//     user1: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     const allConversations = await ctx.db.query("conversations").collect();
//     const userConversations = allConversations.filter((conversation) =>
//       conversation.participants.includes(args.user1)
//     );

//     return userConversations;
//   },
// });

// get conversation last message
export const getLastMessage = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const lastMessage = await ctx.db
      .query("messages")
      .withIndex("byConversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .first();

    if (!lastMessage) {
      return "No messages yet";
    }

    if (lastMessage.type === "image") {
      return "photo....";
    }

    return lastMessage.content;
  },
});

// delet current user conversations
export const deleteUserConversations = mutation({
  args: {
    user1: v.id("users"),
  },
  handler: async (ctx, args) => {
    const allConversations = await ctx.db.query("conversations").collect();

    const userConversations = allConversations.filter((conversation) =>
      conversation.participants.includes(args.user1)
    );

    console.log(userConversations);
    for (const conversation of userConversations) {
      await ctx.db.delete(conversation._id);
    }
  },
});
