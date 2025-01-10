import avatar from "../assets/images/avatar.png";
import { FaSearch } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Input } from "./ui/input";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { useUser } from "@clerk/clerk-react";

type Chat = {
  userId: string;
  friendId: string;
};

type CurrentChatSectionProps = {
  currentChat: Chat | null;
};

export default function ChatLayout({ currentChat }: CurrentChatSectionProps) {
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <section className="hidden h-[100vh] sm:flex sm:flex-col sm:w-[50%] lg:w-[70%] bg-yellow- sm:border sm:border-l-gray-200">
      {currentChat ? (
        <>
          {/* Current Chat */}
          <div className="flex-1 bg-white overflow-y-auto p-4">
            <div className="text-left">
              <p className="bg-gray-200 p-2 rounded-lg mb-2 w-fit hover:bg-gray-300">
                Hi there!
              </p>
              <p className="bg-blue-400 p-2 rounded-lg mb-2 w-fit ml-auto hover:bg-blue-500">
                Hello! How can I help?
              </p>
            </div>
            <p className="text-gray-500 text-center mt-4">No messages yet</p>
          </div>

          {/* Input Messages */}
          <div className="bg-gray-100 h-14 flex items-center px-2">
            <IoIosAdd
              className="text-3xl text-gray-500 cursor-pointer hover:text-gray-600 mr-2"
              aria-label="Add Media"
            />
            <Input
              type="text"
              placeholder="Type a message"
              className="flex-grow bg-white px-3 py-1 rounded-lg outline-none"
              onChange={handleChange}
              value={message}
            />
            {message.trim() ? (
              <IoMdSend
                className="text-3xl text-gray-500 cursor-pointer hover:text-blue-600 ml-2"
                aria-label="Send"
                onClick={handleSend}
              />
            ) : (
              <MdKeyboardVoice
                className="text-3xl text-gray-500 cursor-pointer hover:text-gray-600 ml-2"
                aria-label="Voice Message"
              />
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
