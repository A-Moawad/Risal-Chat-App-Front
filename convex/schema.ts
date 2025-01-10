import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    messageId: v.string(), // Unique identifier (UUID for better uniqueness)
    conversationId: v.id("conversations"), // Associated conversation ID
    senderId: v.id("users"), // User ID of the sender
    content: v.string(), // The actual message text
    type: v.optional(v.string()), // E.g., 'text', 'image', 'video', etc.
    mediaUrl: v.optional(v.string()), // Optional URL for media files
    readBy: v.array(v.id("users")), // Array of user IDs who read the message
    createdAt: v.string(), // Timestamp when the message was created
    updatedAt: v.string(), // Timestamp for the last update
    deletedAt: v.optional(v.string()), // Optional timestamp for soft deletion
  })
    .index("bySenderId", ["senderId"]) // Index for efficient sender lookups
    .index("byConversationId", ["conversationId", "createdAt"]), // Pagination-friendly index

  conversations: defineTable({
    conversationId: v.string(), // Unique identifier
    participants: v.array(v.id("users")), // Array of user IDs involved in the conversation
    lastMessage: v.optional(v.id("messages")), // Optional ID of the last message in the conversation
    createdAt: v.string(), // Timestamp when the conversation was created
    updatedAt: v.string(), // Timestamp for the last update
    deletedAt: v.optional(v.string()), // Optional timestamp for soft deletion
  }).index("byParticipants", ["participants"]), // Index for participant lookups

  users: defineTable({
    name: v.string(), // User's name
    email: v.string(), // Optional email address
    avatarUrl: v.optional(v.string()), // Optional profile picture URL
    lastSeenAt: v.optional(v.string()), // Optional timestamp of last activity
    conversations: v.optional(v.array(v.id("conversations"))), // Optional list of conversation IDs
    friends: v.optional(v.array(v.id("users"))), // Optional friend list
    externalId: v.string(), // Clerk ID, stored in the subject JWT field
    createdAt: v.string(), // Timestamp when the user record was created
    updatedAt: v.string(), // Timestamp for the last update
  })
    .index("byExternalId", ["externalId"])
    .index("byEmail", ["email"]), // Index for external ID lookups
    
  messageReads: defineTable({
    messageId: v.id("messages"), // ID of the message being read
    userId: v.id("users"), // ID of the user who read the message
    readAt: v.string(), // Timestamp of when the message was read
  })
    .index("byMessageId", ["messageId"]) // Efficient lookup for read receipts
    .index("byUserId", ["userId"]), // Lookup messages read by a user
});
