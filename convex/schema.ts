import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    messageId: v.string(), // Unique identifier
    conversationId: v.id("conversations"), // Associated conversation ID
    senderId: v.id("users"), // User ID of the sender
    content: v.string(), // The actual message text
    type: v.optional(v.string()), // E.g., 'text', 'image', 'video', etc.
    mediaUrl: v.optional(v.string()), // Optional URL for media files
    readBy: v.array(v.id("users")), // Array of user IDs who read the message
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("bySenderId", ["senderId"]),

  conversations: defineTable({
    conversationId: v.string(), // Unique identifier
    participants: v.array(v.id("users")), // Array of user IDs involved in the conversation
    lastMessage: v.optional(v.id("messages")), // Optional ID of the last message in the conversation
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("byParticipants", ["participants"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    lastSeenAt: v.optional(v.string()), // Optional timestamp of when the user last saw the app
    conversations: v.optional(v.array(v.id("conversations"))), // Optional list of conversation IDs
    externalId: v.string(), // Clerk ID, stored in the subject JWT field
  }).index("byExternalId", ["externalId"]),
});
