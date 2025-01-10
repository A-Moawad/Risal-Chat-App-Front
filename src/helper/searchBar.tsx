import React from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <div className="flex w-full max-w-[100%] items-center bg-gray-100 rounded-md border ">
      <div className="px-2">
        <FaSearch className="text-gray-500 text-xl" />
      </div>
      <Input
        type="text"
        placeholder="Search"
      />
    </div>
  );
}

export default SearchBar;
