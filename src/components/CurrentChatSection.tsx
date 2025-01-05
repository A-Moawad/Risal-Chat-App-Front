import avatar from "../assets/images/avatar.png";
import { IoMdMore } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Input } from "./ui/input";
import { useState } from "react";

export default function ChatLayout() {
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
    <section className="hidden h-[100vh] md:flex md:flex-col md:w-[50%] lg:w-[70%] bg-yellow-50">
      {/* Header */}
      <div className="flex bg-gray-100 px-3 py-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={avatar}
            alt="current messager"
            className="w-8 h-8 cursor-pointer"
          />
          <h2 className="font-bold">John Doe</h2>
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
        {/* Example messages */}
        <div className="text-left">
          <p className="bg-gray-200 p-2 rounded-lg mb-2 w-fit hover:bg-gray-300">
            Hi there!
          </p>
          <p className="bg-blue-400 p-2 rounded-lg mb-2 w-fit ml-auto hover:bg-blue-500">
            Hello! How can I help?
          </p>
        </div>
      </div>

      {/* Input Messages */}
      <div className="bg-gray-100 h-14 flex items-center px-2">
        <Input
          type="text"
          placeholder="Type a message"
          className="flex-grow bg-white px-3 py-1 rounded-lg outline-none"
          onChange={handleChange}
          value={message}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
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
    </section>
  );
}
