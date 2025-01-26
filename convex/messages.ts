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
      type: "text",
      updatedAt: new Date().toISOString(),
      readBy: [],
    });

    console.log(`Message inserted with ID: ${messageId}`);
    return messageId;
  },
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      senderId: args.senderId,
      conversationId: args.conversationId,
      mediaUrl: args.storageId,
      createdAt: new Date().toISOString(),
      type: "image",
      updatedAt: new Date().toISOString(),
      readBy: [],
    });
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
      .order("asc")
      .collect();

    console.log("Fetched messages:", messages);

    return Promise.all(
      messages.map(async (message) => {
        // Handle case where mediaUrl might be undefined
        let url = null;
        if (message.type === "image" && message.mediaUrl) {
          url = await ctx.storage.getUrl(message.mediaUrl);
        }

        return {
          ...message,
          ...(url ? { url } : {}),
        };
      })
    );
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});