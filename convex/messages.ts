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

export const sendVoice = mutation({
  args: {
    storageId: v.id("_storage"),
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      senderId: args.senderId,
      conversationId: args.conversationId,
      mediaUrl: args.storageId,
      createdAt: new Date().toISOString(),
      type: "voice",
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
        } else if (message.type === "voice" && message.mediaUrl) {
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

export const deleteMessagesByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const allConversations = await ctx.db.query("conversations").collect();
    // Filter conversations where the user is a participant
    const userConversations = allConversations.filter((conversation) =>
      conversation.participants.includes(args.userId)
    );

    for (const conversation of userConversations) {
      // Fetch all messages for the current conversation
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("conversationId"), conversation._id))
        .collect();

      // Delete each message
      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      // Delete the conversation itself
      // await ctx.db.delete(conversation._id);
    }

    return { success: true, deletedConversations: userConversations.length };
  },
});
