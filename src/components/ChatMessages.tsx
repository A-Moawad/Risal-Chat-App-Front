import { useEffect, useRef } from "react";
import { useChat } from "@/contexts/chatContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CurrentChatSkeleton from "@/helper/CurrentChatSkeleton";
import { useConversation } from "@/hooks/UseConversation";
import Loading from "@/helper/Loading";
import "react-h5-audio-player/lib/styles.css";
import AudioPlayer from "react-h5-audio-player";

export default function ChatMessages() {
  const { currentChat } = useChat();
  const { conversationId, loading } = useConversation();

  const conversationMessages = useQuery(
    api.messages.getConversationMessages,
    conversationId ? { conversationId } : "skip"
  );

  const audioRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    if (conversationMessages?.length) {
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      // if (lastMessage.type === "voice") {
      //   audioRef.current?.audio.current?.play(); // Autoplay the last voice message
      // }
    }
  }, [conversationMessages]);

  if (loading) return <CurrentChatSkeleton />;

  if (!conversationMessages) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto p-4">
      {conversationMessages.length > 0 ? (
        conversationMessages.map((msg, index) => (
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
            ) : msg.type === "voice" && msg.mediaUrl ? (
              <>
                {console.log(`Audio URL: ${msg.url}`)}
                <AudioPlayer
                    // ref={index === conversationMessages.length - 1 ? audioRef : null}
                    // Set ref only for last message
                  src={msg.url}
                  showJumpControls={false}
                  layout="stacked-reverse"
                  className="w-60"
                />
              </>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center mt-4">No messages yet</div>
      )}
    </div>
  );
}
