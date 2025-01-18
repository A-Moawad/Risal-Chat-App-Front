import React from "react";
import { FaPlus } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="w-7 h-7 cursor-pointer bg-blue-500 flex justify-center items-center rounded-full hover:bg-blue-600 focus:outline focus:outline-blue-700"
            onClick={handleAddFriendBtn}
            aria-label="Add Friend"
          >
            <FaPlus className="text-white text-sm" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-auto  px-3 py-2 flex items-center justify-center border border-gray-300 bg-white rounded">
          <p className="text-xs text-gray-700 text-center leading-tight">
            Add friend
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AddFriend;
