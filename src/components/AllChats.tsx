import { useChat } from "@/contexts/chatContext";
import { SkeletonDemo } from "@/helper/SingleChatSkeleton";
import { useUser } from "@clerk/clerk-react";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import avatar from "../assets/images/avatar.png";
import SingleChat from "./SingleChat";


function AllChats() {
  const { currentChat, setCurrentChat, searchValue } = useChat();
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

  const filteredFriends = friendList.filter(
    (friend) => friend._id && friend.name?.toLowerCase().includes(searchValue.toLowerCase())
  );


  if (filteredFriends.length === 0) return <p>No matching friends found</p>;

  return (
    <section className="flex flex-col gap-2">
      {filteredFriends.map((friend) =>
        friend?._id ? (
          <SingleChat
            key={friend._id as Id<"users">}
            friendId={friend._id as Id<"users">}
            name={friend.name ?? "Unknown"}
            url={avatar}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            message="Hello there!"
            time="2:30 PM"
            unread={2}
          />
        ) : null
      )}


    </section>
  );
}

export default AllChats;
