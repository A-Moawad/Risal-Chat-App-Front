import React from "react";
import { FaPlus } from "react-icons/fa";
import AddFriendForm from "./AddFriendForm";

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
    <div
      className="w-7 h-7 cursor-pointer bg-blue-500 flex justify-center items-center rounded-full hover:bg-blue-600 focus:outline focus:outline-blue-700"
      onClick={handleAddFriendBtn}
      aria-label="Add Friend"
    >
      <FaPlus className="text-white text-sm" />
    </div>
  );
}

export default AddFriend;
