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

// get conversation
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
