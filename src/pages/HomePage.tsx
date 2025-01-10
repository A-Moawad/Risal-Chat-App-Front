import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";
import { useState } from "react";

type Chat = {
  userId: string;
  friendId: string;
};

const HomePage = () => {
  const [addFriendButtonClicked, setAddFriendButtonClicked] =
    useState<boolean>(false);

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  return (
    <div className="flex ">
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
