import React from "react";
import SingleChat from "./SingleChat";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SkeletonDemo } from "@/helper/SingleChatSkeleton";
import { useChat } from "@/contexts/chatContext";
import avatar from "../assets/images/avatar.png";

function AllChats() {
  const { currentChat, setCurrentChat } = useChat();
  const { user } = useUser();
  const friendList = useQuery(api.users.getFriendList);

  // Check if friendList is loading
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
      {friendList.map((friend, index) => (
        <SingleChat
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          friendId={friend._id}
          key={friend._id}
          name={friend.name}
          url={ avatar}
          message="Hello there!"
          time="2:30 PM"
          unread={2}
        />
      ))}
    </section>
  );
}

export default AllChats;
