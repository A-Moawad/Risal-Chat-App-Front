import AddFriend from "@/helper/AddFriend";
import React from "react";
import { IoMdMore } from "react-icons/io";
import SearchBar from "@/helper/searchBar";
import AllChats from "./AllChats";
import AddFriendForm from "@/helper/AddFriendForm";

type ChatsProps = {
  addFriendButtonClicked: boolean;
  setAddFriendButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

const Chats = ({
  addFriendButtonClicked,
  setAddFriendButtonClicked,
}: ChatsProps) => {
  return (
    <div className="bg-white w-full md:w-[50%] lg:w-[30%] h-[100vh] px-3 py-2 flex flex-col gap-4">
      {/* Header */}
      <section className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Chats</h1>
        <div className="flex items-center gap-2">
          <AddFriend
            addFriendButtonClicked={addFriendButtonClicked}
            setAddFriendButtonClicked={setAddFriendButtonClicked}
          />
          <IoMdMore
            className="cursor-pointer text-2xl"
            aria-label="More Options"
          />
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar />

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto">
        <AllChats />
      </div>

      {/* Conditional Rendering for Add Friend */}
      {addFriendButtonClicked && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <AddFriendForm />
        </div>
      )}
    </div>
  );
};

export default Chats;
