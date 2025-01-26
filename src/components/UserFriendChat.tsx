import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Id } from "convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useChat } from "@/contexts/chatContext";

type ChatType = {
  name: string;
  description: string;
  friendId: Id<"users">;
  url?: string;
};

type Chat = {
  userId: Id<"users">;
  friendId: Id<"users">;
};

type ChatsProps = {
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

function UserFriendChat({
  name,
  description,
  friendId,
  url, 
}: ChatType ) {
  const { currentChat, setCurrentChat } = useChat();
  const { user } = useUser();
  const [userConvexId, setUserConvexId] = useState<Id<"users"> | null>(null);

  const avatarUrl = useQuery(api.users.getUserProfileImage, {
    userId: friendId,
  });

  // Fetch Convex User ID
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
      className={`flex items-center  w-[100%] gap-4 p-4 cursor-pointer border-b ${
        currentChat?.friendId === friendId ? "bg-gray-100" : "border-gray-200"
      } rounded`}
      onClick={handleClick}
      role="button"
      aria-label={`Open chat with ${name}`}
    >
      <img
        src={avatarUrl || url}
        alt={`${name}'s avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 text-start">
        <h2 className="md:text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-600 truncate">{description}</p>
      </div>
    </div>
  );
}

export default UserFriendChat;
