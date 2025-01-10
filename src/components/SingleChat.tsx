import React from "react";
import avatar from "../assets/images/avatar.png";

type ChatType = {
  name: string;
  message: string;
  time: string;
  unread: number;
};

function SingleChat({ name, message, time, unread }: ChatType) {
  const handleClick = () => {
    console.log(`Clicked on chat with: ${name}`);
    // Add additional logic for handling click events, e.g., navigating to a chat or updating the UI.
  };

  return (
    <div
      className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200"
      onClick={handleClick} // Attach the click handler here
    >
      <img
        src={avatar}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h2 className="md:text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-600 truncate">{message}</p>
      </div>
      <div className="text-right">
        <span className="text-xs text-gray-500">{time}</span>
        {unread > 0 && (
          <div className="bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unread}
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleChat;
