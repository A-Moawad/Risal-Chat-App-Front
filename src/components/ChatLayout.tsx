import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useChat } from "@/contexts/chatContext";
import NoConversation from "@/helper/NoConversation";

export default function ChatLayout() {
  const { currentChat } = useChat();

  // Conditional classes:
  const isSmallScreen = "sm:hidden"; // Will hide on small screens
  const showSection = currentChat ? "flex" : "hidden sm:flex"; // Show if there's a current chat; hide otherwise on small screens

  return (
    <section
      className={`w-full h-[100vh] flex-col bg-yellow- sm:border sm:border-l-gray-200 rounded-md sm:rounded-l-none ${showSection}`}
    >
      {currentChat ? (
        <>
          <ChatHeader />
          <ChatMessages />
          <MessageInput />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center bg-white p-8">
          <NoConversation />
        </div>
      )}
    </section>
  );
}
