import React from "react";
import AddFriendForm from "@/helper/AddFriendForm";
import Chats from "./Chats";
import { Id } from "convex/_generated/dataModel";
import UserProfilePage from "@/pages/UserProfilePage";

type Chat = {
  userId: Id<"users">;
  friendId: Id<"users">;
};

type ChatsProps = {
  addFriendButtonClicked: boolean;
  setAddFriendButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  userProfileButtonClicked: boolean;
  setUserProfileButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

function ChatsSection({
  userProfileButtonClicked,
  setUserProfileButtonClicked,
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
      ) : userProfileButtonClicked ? (
        <UserProfilePage/>
      ) : (
        <Chats
          addFriendButtonClicked={addFriendButtonClicked}
          setAddFriendButtonClicked={setAddFriendButtonClicked}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          userProfileButtonClicked={userProfileButtonClicked}
          setUserProfileButtonClicked={setUserProfileButtonClicked}
        />
      )}
    </>
  );
}

export default ChatsSection;
