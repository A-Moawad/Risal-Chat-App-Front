import ChatsSection from "@/components/ChatsSection";
import CurrentChatSection from "@/components/CurrentChatSection";
import { useState } from "react";

const HomePage = () => {
  const [addFriendButtonClicked, setAddFriendButtonClicked] =
    useState<boolean>(false);
  return (
    <div className="flex">
      <ChatsSection
        addFriendButtonClicked={addFriendButtonClicked}
        setAddFriendButtonClicked={setAddFriendButtonClicked}
      />
      <CurrentChatSection />
    </div>
  );
};

export default HomePage;
