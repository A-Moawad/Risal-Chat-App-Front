import { Button } from "@/components/ui/button";
import Logo from "../assets/images/logo.svg?url";


function NoConversation() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white p-8 space-y-4">
      <img src={Logo} alt="Logo" className="w-24 h-24" />
      <h2 className="text-xl font-bold text-gray-700">
        No Active Conversation
      </h2>
      <p className="text-lg text-gray-500">
        Select a conversation or start a new chat to connect with friends.
      </p>
      <Button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => alert("Start a new conversation")}
      >
        Start New Chat
      </Button>
    </div>
  );
}

export default NoConversation;
