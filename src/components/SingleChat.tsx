import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@/contexts/chatContext";
import { useUser } from "@clerk/clerk-react";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import readIcon from "@/assets/images/read.jpg";



type ChatType = {
  name: string;
  message: string;
  time: string;
  // unread: number;
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

function SingleChat({
  name,
  message,
  time,
  // unread,
  friendId,
  currentChat,
  setCurrentChat,
  url,
}: ChatType & ChatsProps) {
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const { user } = useUser();
  const { currentUserId, setCurrentUserId } = useChat();

  // Fetch Convex User ID
  const userConvexId = useQuery(
    api.users.getIdByExternalId,
    user?.id ? { externalId: user.id } : "skip"
  );

  // Set currentUserId to userConvexId when it is available
  useEffect(() => {
    if (userConvexId) {
      setCurrentUserId(userConvexId);
    }
  }, [userConvexId, setCurrentUserId]);

  // Fetch Friend's Avatar
  const avatarUrl = useQuery(api.users.getUserProfileImage, {
    userId: friendId,
  });

  // Fetch or create conversation ID
  const conversationIdd = useQuery(
    api.conversations.getConversationId,
    userConvexId && friendId ? { user1: userConvexId, user2: friendId } : "skip"
  );

  // Set the conversation ID
  useEffect(() => {
    if (conversationIdd) {
      setConversationId(conversationIdd);
    }
  }, [conversationIdd]);

  const createConversationMutation = useMutation(
    api.conversations.createConversation
  );




  // Handle fallback to creating a new conversation
  useEffect(() => {
    if (user?.id && currentChat?.friendId && !conversationIdd) {
      const createOrFetchConversation = async () => {
        try {
          const { conversationId } = await createConversationMutation({
            user1: currentChat?.userId,
            user2: currentChat?.friendId,
          });
          setConversationId(conversationId);
        } catch (error) {
          console.error("Failed to create or fetch conversation:", error);
        }
      };

      createOrFetchConversation();
    }
  }, [user?.id, currentChat?.friendId, createConversationMutation]);

  const markMessagesAsRead = useMutation(
    api.markAsRead.markMessagesAsRead
  )

  useEffect(() => {
    if (currentChat?.friendId === friendId && currentUserId && conversationId) {
      markMessagesAsRead({
        userId: currentUserId,
        conversationId,
        readAt: new Date().toISOString(),
      });
    }
  }, [currentChat, currentUserId, conversationId, friendId, markMessagesAsRead]);


  const lastMessage = useQuery(
    api.conversations.getLastMessage,
    conversationId
      ? { conversationId: conversationId as Id<"conversations"> }
      : "skip"
  );


  const unreadMessagesCount = useQuery(
    api.markAsRead.getUnreadCount,
    currentUserId && conversationId
      ? {
        userId: currentUserId,
        conversationId: conversationId as Id<"conversations">,
      }
      : "skip"
  );



  const handleClick = () => {
    if (!userConvexId) {
      console.error("Convex ID is not yet available.");
      return;
    }
    setCurrentChat({ userId: userConvexId, friendId });
    console.log(`Switched to chat with: ${name}`);
  };

  const avatarSrc = avatarUrl || url || "/default-avatar.png";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`flex items-center gap-4 p-4 cursor-pointer border-b ${currentChat?.friendId === friendId
              ? "bg-gray-100"
              : "border-gray-200"
              } rounded`}
            onClick={handleClick}
            role="button"
            aria-label={`Open chat with ${name}`}
          >
            <img
              src={avatarSrc}
              alt={`${name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 text-start">
              <h2 className="md:text-lg font-bold">{name}</h2>
              <p className="text-sm text-gray-600 truncate">
                {lastMessage
                  ? lastMessage.type === "image"
                    ? "photo..."
                    : lastMessage.content
                  : "No messages yet"}
              </p>

            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500">{time}</span>
              {unreadMessagesCount !== undefined && unreadMessagesCount > 0 && (
                <div className="bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadMessagesCount}
                </div>
              )}
              {lastMessage && lastMessage.senderId === currentUserId &&
                lastMessage.readBy?.includes(friendId) && (
                <img src={readIcon} alt="read icon" className="w-4 h-4" />

                )}




            </div>
          </div>
          <TooltipContent
            side="bottom"
            align="center"
            sideOffset={1}
            alignOffset={10}
            className="w-auto px-3 py-2 flex items-center justify-center border border-gray-300 bg-white rounded"
          >
            <p className="text-xs text-gray-700 text-center leading-tight">
              {name}
            </p>
          </TooltipContent>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SingleChat;
