import React from "react";
import SingleChat from "./SingleChat";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
type Chat = {
  userId: string;
  friendId: string;
};
type ChatsProps = {
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

function AllChats({currentChat, setCurrentChat}: ChatsProps) {
  const { user } = useUser();
  const friendList = useQuery(api.users.getFriendList);

  if (!friendList) return <p>Loading...</p>;
  if (friendList.length === 0) return <p>No friends yet</p>;

  return (
    <section className="flex flex-col gap-2">
      {friendList.map((friend) => (
        <SingleChat
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
