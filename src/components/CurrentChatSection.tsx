import avatar from "../assets/images/avatar.png";
import { FaSearch } from "react-icons/fa";
import { IoMdMore, IoMdSend } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import CurrentChatSkeleton from "@/helper/CurrentChatSkeleton";
import NoConversation from "@/helper/NoConversation";
import { useChat } from "@/contexts/chatContext";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";

export default function ChatLayout() {
  const { currentChat, setCurrentChat } = useChat();
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

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

    if (!user?.id || !conversationId) {
      console.error("Missing user ID or conversation ID");
      return;
    }

    if (selectedImage) {
      // Handle image upload
      try {
        setIsUploading(true);
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        const { storageId } = json;

        await sendImage({
          storageId,
          senderId: currentChat?.userId as Id<"users">,
          conversationId,
        });

        toast("Image sent successfully!");
        setSelectedImage(null);
      } catch (error) {
        console.error("Error sending image:", error);
      } finally {
        setIsUploading(false);
      }
    } else if (message.trim()) {
      // Handle text message
      try {
        await sendMessage({
          senderId: currentChat?.userId as Id<"users">,
          conversationId,
          content: message,
        });
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
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
                <div
                  key={msg._id}
                  className={`p-2 rounded-lg mb-2 w-fit max-w-xs ${
                    msg.senderId === currentChat.userId
                      ? "bg-blue-400 ml-auto text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.type === "image" ? (
                    <img
                      src={msg.url}
                      alt="Sent media"
                      className="rounded-lg max-w-full"
                    />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              ))
            ) : (
              <>{!conversationMessages?.length && <CurrentChatSkeleton />}</>
            )}
          </div>

          {/* Input Messages */}
          <div className="bg-gray-100 h-14 flex items-center px-2">
            <input
              title="input message"
              type="file"
              accept="image/*"
              ref={imageInput}
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInput.current?.click()}
              className="text-3xl text-gray-500 hover:text-gray-600 mr-2"
              title="Add Media"
              aria-label="Add Media"
            >
              <IoIosAdd />
            </button>
            
            <form className="flex items-center w-full" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message"
                className="flex-grow bg-white px-3 py-1 rounded-lg outline-none"
                onChange={handleChange}
                value={message}
              />
              <Button
                type="submit"
                className="ml-2 bg-transparent border-none hover:bg-transparent"
                disabled={!message.trim() && !selectedImage}
              >
                <IoMdSend
                  className="text-3xl text-gray-500 cursor-pointer hover:text-blue-600"
                  aria-label="Send"
                />
              </Button>
            </form>
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
