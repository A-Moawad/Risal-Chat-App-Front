import AddFriend from "@/helper/AddFriend";
import React from "react";
import { IoMdMore } from "react-icons/io";
import SearchBar from "@/helper/searchBar";
import SingleChat from "./SingleChat";
import AllChats from "./AllChats";

function Chats() {
  return (
    <div className="bg-white w-full md:w-[50%] lg:w-[30%] h-[100vh] px-3 py-2 flex flex-col gap-4">
      {/* Header */}
      <section className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h1 className="text-xl font-bold">Chats</h1>
        <div className="flex items-center gap-2">
          <AddFriend />
          <IoMdMore className="cursor-pointer text-2xl" />
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar />

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto">
        <AllChats />
      </div>
    </div>
  );
}

export default Chats;
