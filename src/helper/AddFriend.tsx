import React from "react";
import { FaPlus } from "react-icons/fa";

function AddFriend() {
  return (
    <div className=" w-7 h-7 cursor-pointer bg-sky-600 flex justify-center items-center">
      <FaPlus className="text-white text-sm "/>
    </div>
  );
}

export default AddFriend;
