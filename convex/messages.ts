import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Sending message with args:", args);

    const messageId = await ctx.db.insert("messages", {
      senderId: args.senderId,
      conversationId: args.conversationId,
      content: args.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readBy: [],
    });

    console.log(`Message inserted with ID: ${messageId}`);
    return messageId;
  },
});


export const getConversationMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    console.log("Fetching messages for conversation ID:", args.conversationId);

    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc") // Ascending order
      .collect();

    console.log("Fetched messages:", messages);
    return messages;
  },
});

