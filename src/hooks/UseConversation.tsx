import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useChat } from "@/contexts/chatContext";

export function useConversation() {
  const { currentChat } = useChat();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const createConversationMutation = useMutation(
    api.conversations.createConversation
  );
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (currentChat?.userId && currentChat?.friendId) {
      const createOrFetchConversation = async () => {
        try {
          setLoading(true);
          const { conversationId } = await createConversationMutation({
            user1: currentChat.userId,
            user2: currentChat.friendId,
          });
          setConversationId(conversationId);
        } catch (error) {
          console.error("Failed to create or fetch conversation:", error);
        } finally {
          setLoading(false);
        }
      };

      createOrFetchConversation();
    } else {
      setConversationId(null);
      setLoading(false);
    }
  }, [currentChat, createConversationMutation]);

  return { conversationId, loading };
}
