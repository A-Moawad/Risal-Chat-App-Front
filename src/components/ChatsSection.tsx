import React, { useState } from "react";
import AddFriendForm from "@/helper/AddFriendForm";
import Chats from "./Chats";
import { Id } from "convex/_generated/dataModel";

type Chat = {
  userId: Id<"users">; // Use Id<"users">
  friendId: Id<"users">; // Use Id<"users">
};


type ChatsProps = {
  addFriendButtonClicked: boolean;
  setAddFriendButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};
function ChatsSection({
  addFriendButtonClicked,
  setAddFriendButtonClicked,
  currentChat,
  setCurrentChat,
}: ChatsProps) {
  return (
    <>
      {addFriendButtonClicked ? (
        <AddFriendForm
          addFriendButtonClicked={addFriendButtonClicked}
          setAddFriendButtonClicked={setAddFriendButtonClicked}
        />
      ) : (
        <Chats
          addFriendButtonClicked={addFriendButtonClicked}
          setAddFriendButtonClicked={setAddFriendButtonClicked}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
        />
      )}
    </>
  );
}

export default ChatsSection;
