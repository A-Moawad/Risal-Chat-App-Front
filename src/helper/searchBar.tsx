import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <div className="flex w-full max-w-[100%] h-[100%] items-center ">
      <Input type="email" placeholder="Email" className="chat-search" />
      <div className="search-icon w-[40px] h-[40px]">
        <FaSearch className="text-white text-xl" />
      </div>
    </div>
  );
}

export default SearchBar;
