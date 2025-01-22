import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";

const HomePage = () => {
  return (
    <div className="flex h-[100vh]">
      <ChatsSection
      />
      <CurrentChatSection 
      />
    </div>
  );
};

export default HomePage;
