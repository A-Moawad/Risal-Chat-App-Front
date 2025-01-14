import avatar from "../assets/images/avatar.png";
import { FaSearch } from "react-icons/fa";
import { IoMdMore, IoMdSend } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { Button } from "./ui/button";

type Chat = {
  userId: Id<"users">;
  friendId: Id<"users">;
};
type CurrentChatSectionProps = {
  currentChat: Chat | null;
};

export default function ChatLayout({ currentChat }: CurrentChatSectionProps) {
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  console.log(currentChat);

  const sendMessage = useMutation(api.messages.sendMessage);

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
        senderId: user.id as Id<"users">,
        conversationId,
        content: message,
      });

      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <section className="hidden h-[100vh] sm:flex sm:flex-col sm:w-[50%] lg:w-[70%] bg-yellow- sm:border sm:border-l-gray-200">
      {currentChat ? (
        <>
          {/* Header */}
          <div className="flex bg-gray-100 p-3 items-center justify-between">
            <div className="flex gap-3 items-center">
              <img
                src={avatar}
                alt={`Avatar of ${currentFriend?.name || "Unknown"}`}
                className="w-8 h-8 cursor-pointer rounded-full"
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
          {/* <div className="flex-1 bg-white overflow-y-auto p-4">
            <div className="text-left">
              <p className="bg-gray-200 p-2 rounded-lg mb-2 w-fit hover:bg-gray-300">
                Hi there!
              </p>
              <p className="bg-blue-400 p-2 rounded-lg mb-2 w-fit ml-auto hover:bg-blue-500">
                Hello! How can I help?
              </p>
            </div>
            <p className="text-gray-500 text-center mt-4">No messages yet</p>
          </div> */}
          <div className="flex-1 bg-white overflow-y-auto p-4">
            {conversationMessages?.length ? (
              conversationMessages.map((msg) => (
                <p
                  key={msg._id}
                  className={`p-2 rounded-lg mb-2 w-fit ${
                    msg.senderId === user?.id
                      ? "bg-blue-400 ml-auto text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </p>
              ))
            ) : (
              <>
                {!conversationMessages?.length && (
                  <p className="text-gray-500 text-center mt-4">
                    No messages yet. Start by sending a message!
                  </p>
                )}
              </>
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
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Welcome to the Chat!
            </h2>
            <p className="text-lg text-gray-500 mb-6">
              No active chat at the moment. Start a new conversation with a
              friend!
            </p>
            <div className="flex justify-center gap-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Start a New Chat
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Search for Friends
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
