import React from "react";
import { FaPlus } from "react-icons/fa";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type AddFriendForm = {
  addFriendButtonClicked: boolean;
  setAddFriendButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddFriend({
  addFriendButtonClicked,
  setAddFriendButtonClicked,
}: AddFriendForm) {
  const handleAddFriendBtn = () => {
    setAddFriendButtonClicked(!addFriendButtonClicked);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="w-7 h-7 cursor-pointer bg-blue-500 flex justify-center items-center rounded-full hover:bg-blue-600 focus:outline focus:outline-blue-700"
          onClick={handleAddFriendBtn}
          aria-label="Add Friend"
        >
          <FaPlus className="text-white text-sm" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[100px] h-[30px] p-1 flex items-center justify-center">
        <p className="text-xs text-gray-700 text-center leading-tight">
          Add friend
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

export default AddFriend;
