import { useState, useRef } from "react";
import { IoMdSend, IoIosAdd } from "react-icons/io";
import VoiceRecorder from "./VoiceRecorder";
import { Button } from "./ui/button";
import { useChat } from "@/contexts/chatContext";
import { useConversation } from "@/hooks/UseConversation";
import { toast } from "sonner";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MessageInput() {
  const { currentChat } = useChat();
  const { conversationId } = useConversation();
  const userId = currentChat?.userId ?? null;

  const {
    sendTextMessage,
    sendImageMessage,
    sendVoiceMessage,
    isUploading,
    setIsUploading,
    isVoiceUploading,
    setIsVoiceUploading,
  } = useSendMessage(conversationId, userId);

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage && !recordedAudio && !message.trim()) return; // Prevent empty message submission

    try {
      if (selectedImage) {
        setIsUploading(true);
        await sendImageMessage(selectedImage);
        setSelectedImage(null);
        setIsUploading(false);
      } else if (recordedAudio) {
        setIsVoiceUploading(true);
        await sendVoiceMessage(recordedAudio);
        setRecordedAudio(null);
        setIsVoiceUploading(false);
      } else {
        await sendTextMessage(message);
        setMessage("");
      }
    } catch (error) {
      toast.error(`Error sending message`, {
        duration: 3000,
        position: "top-right",
        className: "bg-red-500 text-white font-semibold",
      });
    }
  };

  return (
    <div className="bg-gray-100 h-14 flex items-center px-2">
      <input
        title="file image"
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
        className="hidden"
      />
      <Button
        onClick={() => imageInput.current?.click()}
        className="text-3xl text-gray-500 mr-2"
        disabled={isUploading}
      >
        <IoIosAdd />
      </Button>

      {/* Handle voice recording */}
      <VoiceRecorder onVoiceRecorded={setRecordedAudio} />

      <form onSubmit={handleSend} className="flex items-center w-full">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-grow bg-white px-3 py-1 rounded-lg outline-none"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          disabled={isUploading || isVoiceUploading}
        />
        <Button type="submit" disabled={isUploading || isVoiceUploading}>
          <IoMdSend className="text-3xl text-gray-500 hover:text-blue-600" />
        </Button>
      </form>
    </div>
  );
}
