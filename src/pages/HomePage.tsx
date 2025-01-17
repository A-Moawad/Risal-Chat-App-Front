import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

type Chat = {
  userId: Id<"users">; // Use Id<"users">
  friendId: Id<"users">; // Use Id<"users">
};

const HomePage = () => {
  const [addFriendButtonClicked, setAddFriendButtonClicked] =
    useState<boolean>(false);

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  return (
    <div className="flex h-[100vh]">
      <ChatsSection
        addFriendButtonClicked={addFriendButtonClicked}
        setAddFriendButtonClicked={setAddFriendButtonClicked}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <CurrentChatSection currentChat={currentChat} />
    </div>
  );
};

export default HomePage;
