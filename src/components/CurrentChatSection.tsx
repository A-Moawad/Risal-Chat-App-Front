import avatar from "../assets/images/avatar.png";
import { FaSearch } from "react-icons/fa";
import { IoMdMore, IoMdSend } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import CurrentChatSkeleton from "@/helper/CurrentChatSkeleton";
import NoConversation from "@/helper/NoConversation";
import { useChat } from "@/contexts/chatContext";
import { Id } from "convex/_generated/dataModel";

export default function ChatLayout() {
  const { currentChat, setCurrentChat } = useChat();

  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [chatParticipant, setChat] = useState<Id<"users"> | null>(null);

  console.log(currentChat);

  const sendMessage = useMutation(api.messages.sendMessage);

  const avatarUrl = useQuery(
    api.users.getUserProfileImage,
    currentChat?.friendId
      ? { userId: currentChat.friendId as Id<"users"> }
      : "skip"
  );

  const createConversationMutation = useMutation(
    api.conversations.createConversation
  );

  const conversationMessages = useQuery(
    api.messages.getConversationMessages,
    conversationId ? { conversationId } : "skip"
  );

  // Create or fetch the conversation when the currentChat or user changes
  useEffect(() => {
    if (user?.id && currentChat?.friendId) {
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

  const currentFriend = useQuery(
    api.users.getFriend,
    currentChat?.friendId
      ? { friendId: currentChat.friendId as Id<"users"> }
      : "skip"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user?.id || !conversationId) {
      console.error("Missing message, user ID, or conversation ID");
      return;
    }

    try {
      await sendMessage({
        senderId: currentChat?.userId as Id<"users">,
        conversationId,
        content: message,
      });

      console.log();

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <section className="hidden h-[100vh] sm:flex sm:flex-col sm:w-[50%] lg:w-[70%] bg-yellow- sm:border sm:border-l-gray-200 rounded-md sm:rounded-l-none">
      {currentChat ? (
        <>
          {/* Header */}
          <div className="flex bg-gray-100 p-3 items-center justify-between">
            <div className="flex gap-3 items-center">
              <img
                src={avatarUrl || avatar}
                alt={`Avatar of ${currentFriend?.name || "Unknown"}`}
                className="w-10 h-10 cursor-pointer rounded-full"
              />

              <h2 className="font-bold">
                {currentFriend?.name || "Loading..."}
              </h2>
            </div>
            <div className="flex gap-2">
              <FaSearch className="text-xl cursor-pointer hover:text-gray-600" />
              <IoMdMore
                className="cursor-pointer text-2xl hover:text-gray-600"
                aria-label="More Options"
              />
            </div>
          </div>

          {/* Current Chat */}

          <div className="flex-1 bg-white overflow-y-auto p-4">
            {conversationMessages?.length ? (
              conversationMessages.map((msg) => (
                <p
                  key={msg._id}
                  className={`p-2 rounded-lg mb-2 w-fit ${
                    msg.senderId === currentChat.userId
                      ? "bg-blue-400 ml-auto text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </p>
              ))
            ) : (
              <>{!conversationMessages?.length && <CurrentChatSkeleton />}</>
            )}
          </div>

          {/* Input Messages */}
          <div className="bg-gray-100 h-14 flex items-center px-2">
            <IoIosAdd
              className="text-3xl text-gray-500 cursor-pointer hover:text-gray-600 mr-2"
              aria-label="Add Media"
              title="Add Media"
            />
            {conversationId ? (
              <form className="flex items-center w-full" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type a message"
                  className="flex-grow bg-white px-3 py-1 rounded-lg outline-none"
                  onChange={handleChange}
                  value={message}
                />
                {message.trim() ? (
                  <Button
                    type="submit"
                    className="ml-2 bg-transparent border-none hover:bg-transparent"
                    disabled={!message.trim() || !conversationId}
                  >
                    <IoMdSend
                      className="text-3xl text-gray-500 cursor-pointer hover:text-blue-600"
                      aria-label="Send"
                    />
                  </Button>
                ) : (
                  <MdKeyboardVoice
                    className="text-3xl text-gray-500 cursor-pointer hover:text-gray-600 ml-2"
                    aria-label="Voice Message"
                  />
                )}
              </form>
            ) : (
              <div className="text-gray-500 text-center w-full">
                Loading chat...
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center bg-white p-8">
          <NoConversation />
        </div>
      )}
    </section>
  );
}
