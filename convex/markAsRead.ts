// convex/messages/markAsRead.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const markMessagesAsRead = mutation({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    readAt: v.string(),
  },
  handler: async (ctx, { userId, conversationId, readAt }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversationId", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    const unread = messages.filter((msg) => !msg.readBy?.includes(userId));

    await Promise.all(
      unread.map(async (msg) => {
        // Add user to message.readBy
        await ctx.db.patch(msg._id, {
          readBy: [...(msg.readBy ?? []), userId],
        });

        // Add a record to messageReads table
        await ctx.db.insert("messageReads", {
          messageId: msg._id,
          userId,
          readAt,
        });
      })
    );
  },
});

export const getUnreadCount = query({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { userId, conversationId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversationId", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    const unreadMessages = messages.filter(
      (msg) =>
        msg.senderId !== userId && // Only count others' messages
        (!msg.readBy || !msg.readBy.includes(userId)) // Not read yet
    );

    return unreadMessages.length;
  },
});


