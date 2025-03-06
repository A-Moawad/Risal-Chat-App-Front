import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useChat } from "@/contexts/chatContext";
import NoConversation from "@/helper/NoConversation";

export default function ChatLayout() {
  const { currentChat } = useChat();

  return (
    <section className="hidden h-[100vh] sm:flex sm:flex-col sm:w-[50%] lg:w-[70%] bg-yellow- sm:border sm:border-l-gray-200 rounded-md sm:rounded-l-none">
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
