import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";
import { useChat } from "@/contexts/chatContext";

const HomePage = () => {
  const { currentChat, currentChatButtonClicked } = useChat();

  return (
    <div className="flex h-[100vh] bg-white">
      {/* ChatsSection */}
      <div
        className={`
          w-full
          sm:w-[50%] lg:w-[40%]
          ${
          // If no current chat, always show ChatsSection
          !currentChat
            ? "flex"
            : // if currentChat exists, show or hide ChatsSection based on currentChatButtonClicked
            currentChatButtonClicked
              ? "flex"
              : "hidden sm:flex"
          }
          flex-col
        `}
      >
        <ChatsSection />
      </div>

      {/* CurrentChatSection */}
      <div
        className={`
          w-full
          sm:w-[50%] lg:w-[60%]
          ${
          // Hide CurrentChatSection if no currentChat
          !currentChat
            ? "hidden"
            : currentChatButtonClicked
              ? "hidden sm:flex"
              : "flex"
          }
          flex-col
        `}
      >
        <CurrentChatSection />
      </div>
    </div>
  );
};

export default HomePage;
