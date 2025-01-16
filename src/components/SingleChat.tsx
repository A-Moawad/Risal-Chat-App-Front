import React, { useEffect, useState } from "react";
import avatar from "../assets/images/avatar.png";
import { useUser } from "@clerk/clerk-react";
import { Id } from "convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SkeletonDemo } from "@/helper/SingleChatSkeleton";

type ChatType = {
  name: string;
  message: string;
  time: string;
  unread: number;
  friendId: Id<"users">;
};

type Chat = {
  userId: Id<"users">;
  friendId: Id<"users">;
};

type ChatsProps = {
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

function SingleChat({
  name,
  message,
  time,
  unread,
  friendId,
  currentChat,
  setCurrentChat,
}: ChatType & ChatsProps) {
  const { user } = useUser();
  const [userConvexId, setUserConvexId] = useState<Id<"users"> | null>(null);

  const userConvexIdQuery = useQuery(
    api.users.getIdByExternalId,
    user?.id ? { externalId: user.id } : "skip"
  );

  useEffect(() => {
    if (userConvexIdQuery) {
      setUserConvexId(userConvexIdQuery);
    }
  }, [userConvexIdQuery]);

  const handleClick = () => {
    if (!userConvexId) {
      console.error("Convex ID is not yet available.");
      return;
    }
    setCurrentChat({ userId: userConvexId, friendId });
    console.log(`Switched to chat with: ${name}`);
  };

  return (
    <div
      className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200"
      onClick={handleClick}
      role="button"
      aria-label={`Open chat with ${name}`}
    >
      <img
        src={avatar}
        alt="Profile avatar"
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
