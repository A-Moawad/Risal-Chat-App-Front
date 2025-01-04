import avatar from "../assets/images/avatar.png";
import { IoMdMore } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

function CurrentChat() {
  return (
    <section className="hidden h-[100vh] md:flex md:w-[50%] lg:w-[70%] bg-yellow-50 flex-col  ">
      <section>
        {/* Header */}
        <div className="flex bg-gray-100 px-3 py-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <img
              src={avatar}
              alt="current messager image"
              className="w-8 h-8 cursor-pointer"
            />
            <h2 className="font-bold ">John Due</h2>
          </div>
          <div className="flex gap-2">
            <FaSearch className=" text-xl cursor-pointer" />
            <IoMdMore
              className="cursor-pointer text-2xl"
              aria-label="More Options"
            />
          </div>
        </div>

        {/* Current Chat  */}

        {/* Input messages  */}
      </section>
      {/* <div className="space-y-2">
        <button
          className="text-white px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700"
          onClick={startNewChat}
          aria-label="Start a new chat"
        >
          Start a new chat
        </button>
        <button
          className="text-white px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600"
          onClick={closeChat}
          aria-label="Close this chat"
        >
          Close this chat
        </button>
      </div> */}
    </section>
  );
}

export default CurrentChat;
