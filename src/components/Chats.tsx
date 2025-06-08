import AddFriend from "@/helper/AddFriend";
import React from "react";
import SearchBar from "@/helper/searchBar";
import AllChats from "./AllChats";
import AddFriendForm from "@/helper/AddFriendForm";
import UserMoreOPtoins from "@/helper/UserMoreOPtoins";
import { useChat } from "@/contexts/chatContext";

const Chats = () => {
  const {
    addFriendButtonClicked,
    setAddFriendButtonClicked,
    currentChat
  } = useChat();

  return (
    <div className="bg-white w-full h-[100vh]  flex flex-col gap-4 px-3 rounded-md sm:rounded-r-none">
      {/* Header */}
      <section className="flex justify-between items-center p-3 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Chats</h1>
        <div className="flex items-center gap-2">
          <AddFriend
            addFriendButtonClicked={addFriendButtonClicked}
            setAddFriendButtonClicked={setAddFriendButtonClicked}
          />
          <UserMoreOPtoins />
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar />

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto">
        <AllChats  />
      </div>

      {/* Conditional Rendering for Add Friend */}
      {addFriendButtonClicked && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <AddFriendForm
          />
        </div>
      )}
    </div>
  );
};

export default Chats;
