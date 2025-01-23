import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";

const HomePage = () => {
  return (
    <div className="flex h-[100vh] bg-white">
      <ChatsSection
      />
      <CurrentChatSection 
      />
    </div>
  );
};

export default HomePage;
