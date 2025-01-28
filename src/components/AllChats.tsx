import React from "react";
import SingleChat from "./SingleChat";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SkeletonDemo } from "@/helper/SingleChatSkeleton";
import { useChat } from "@/contexts/chatContext";
import avatar from "../assets/images/avatar.png";

function AllChats() {
  const { currentChat, setCurrentChat, searchValue } = useChat();
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

  // Filter friends based on searchValue
  const filteredFriends = friendList.filter((friend) =>
    friend.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (filteredFriends.length === 0) return <p>No matching friends found</p>;

  return (
    <section className="flex flex-col gap-2">
      {filteredFriends.map((friend) => (
        <SingleChat
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          friendId={friend._id}
          key={friend._id}
          name={friend.name}
          url={avatar}
          message="Hello there!"
          time="2:30 PM"
          unread={2}
        />
      ))}
    </section>
  );
}

export default AllChats;
