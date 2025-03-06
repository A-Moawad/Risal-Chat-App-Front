import { FaSearch } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import avatar from "../assets/images/avatar.png";
import { useChat } from "@/contexts/chatContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export default function ChatHeader() {
  const { currentChat } = useChat();

  const avatarUrl = useQuery(
    api.users.getUserProfileImage,
    currentChat?.friendId
      ? { userId: currentChat.friendId as Id<"users"> }
      : "skip"
  );

  const currentFriend = useQuery(
    api.users.getFriend,
    currentChat?.friendId
      ? { friendId: currentChat.friendId as Id<"users"> }
      : "skip"
  );

  return (
    <div className="flex bg-gray-100 p-3 items-center justify-between">
      <div className="flex gap-3 items-center">
        <img
          src={avatarUrl || avatar}
          alt={`Avatar of ${currentFriend?.name || "Unknown"}`}
          className="w-10 h-10 cursor-pointer rounded-full"
        />
        <h2 className="font-bold">{currentFriend?.name || "Loading..."}</h2>
      </div>
      <div className="flex gap-2">
        <FaSearch className="text-xl cursor-pointer hover:text-gray-600" />
        <IoMdMore className="cursor-pointer text-2xl hover:text-gray-600" />
      </div>
    </div>
  );
}
