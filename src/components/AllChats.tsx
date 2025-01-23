import React from "react";
import SingleChat from "./SingleChat";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SkeletonDemo } from "@/helper/SingleChatSkeleton";
import { useChat } from "@/contexts/chatContext";


function AllChats() {
  const {
    currentChat,
    setCurrentChat,
  } = useChat();
  const { user } = useUser();
  const friendList = useQuery(api.users.getFriendList);

  if (!friendList)
    return (
      <>
        <SkeletonDemo />
        <SkeletonDemo />
        <SkeletonDemo />
        <SkeletonDemo />
        <SkeletonDemo />
      </>
    );
  if (friendList.length === 0) return <p>No friends yet</p>;

  return (
    <section className="flex flex-col gap-2">
      {friendList.map((friend) => (
        <SingleChat
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          friendId={friend._id}
          key={friend._id}
          name={friend.name}
          message="Hello there!"
          time="2:30 PM"
          unread={2}
        />
      ))}
    </section>
  );
}

export default AllChats;
