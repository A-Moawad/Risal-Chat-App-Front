import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { useChat } from "@/contexts/chatContext";


function SearchBar() {
  const { searchValue, setSearchValue } = useChat()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    console.log("Search Value:", e.target.value); 
  };

  return (
    <div className="flex w-full max-w-[100%] items-center bg-gray-100 rounded-md border">
      <div className="px-2">
        <FaSearch className="text-gray-500 text-xl" />
      </div>
      <Input
        type="text"
        placeholder="Search"
        value={searchValue}
        onChange={handleChange}
        className="bg-transparent border-none outline-none focus:ring-0"
      />
    </div>
  );
}

export default SearchBar;
