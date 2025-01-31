import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";
import { useChat } from "@/contexts/chatContext";
import { useUser } from "@clerk/clerk-react";
import { api } from "convex/_generated/api"; // Correct import
import { useQuery } from "convex/react";
import { useEffect } from "react";

const HomePage = () => {
  return (
    <div className="flex h-[100vh] bg-white">
      <ChatsSection />
      <CurrentChatSection />
    </div>
  );
};

export default HomePage;
