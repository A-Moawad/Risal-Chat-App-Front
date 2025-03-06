import { useChat } from "@/contexts/chatContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CurrentChatSkeleton from "@/helper/CurrentChatSkeleton";
import { useConversation } from "@/hooks/UseConversation";
import Loading from "@/helper/Loading";

export default function ChatMessages() {
  const { currentChat } = useChat();
  const { conversationId, loading } = useConversation();

  const conversationMessages = useQuery(
    api.messages.getConversationMessages,
    conversationId ? { conversationId } : "skip"
  );

  if (loading) {
    return <CurrentChatSkeleton />;
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto p-4">
      {conversationMessages?.length ? (
        conversationMessages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded-lg mb-2 w-fit max-w-xs ${
              msg.senderId === currentChat?.userId
                ? "bg-blue-400 ml-auto text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.type === "image" ? (
              <img
                src={msg.url}
                alt="Sent media"
                className="rounded-lg max-w-full"
              />
            ) : msg.type === "voice" ? (
              <audio controls className="w-full">
                <source src={msg.url} type="audio/webm" />
              </audio>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))
      ) : (
        <CurrentChatSkeleton />
      )}
    </div>
  );
}
