import { useChat } from "@/contexts/chatContext";
import { useConversation } from "@/hooks/UseConversation";
import { useSendMessage } from "@/hooks/useSendMessage";
import imageCompression from "browser-image-compression";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { IoIosAdd, IoMdSend } from "react-icons/io";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import VoiceRecorder from "./VoiceRecorder";
import { Button } from "./ui/button";


export default function MessageInput() {
  const { currentChat } = useChat();
  const { conversationId } = useConversation();
  const userId = currentChat?.userId ?? null;
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasImages = selectedImages.length > 0;
    const hasAudio = !!recordedAudio;
    const hasText = message.trim().length > 0;

    if (!hasImages && !hasAudio && !hasText) return;

    try {
      if (hasImages) {
        setIsUploading(true);
        const total = selectedImages.length;
        for (let i = 0; i < total; i++) {
          // await sendImageMessage(selectedImages[i]);
          const image = selectedImages[i];
          const compressed = await imageCompression(image, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });

          await sendImageMessage(compressed);
          setUploadProgress(Math.round(((i + 1) / total) * 100));
        }
        setSelectedImages([]);
        setUploadProgress(0);
        setIsUploading(false);
      }

      if (hasAudio) {
        setIsVoiceUploading(true);
        await sendVoiceMessage(recordedAudio);
        setRecordedAudio(null);
        setIsVoiceUploading(false);
      }

      if (hasText) {
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
    <div className="relative bg-gray-100 px-4 py-2 ">
      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-4 p-2 bg-white border border-gray-300 rounded-lg mb-4">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setSelectedImages((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 transition text-white rounded-full px-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full px-4 mb-4">
          <div className="h-2 bg-gray-300 rounded">
            <div
              className="h-2 bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-500 mt-1">
            Uploading {uploadProgress}%
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files).filter((file) =>
              file.type.startsWith("image/")
            );
            setSelectedImages((prev) => [...prev, ...files]);
          }}
          className="bg-gray-100 flex  lg:gap-3  items-center  rounded mb-2 "
        >
          {/* Image Add Section */}
          <div className="  flex items-center gap-2">
            {/* File Input */}
            <input
              title="image sending"
              type="file"
              accept="image/*"
              multiple
              ref={imageInput}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setSelectedImages((prev) => [...prev, ...files]);
              }}

              className="hidden"
            />

            {/* Image Add Button */}
            <Button
              onClick={() => imageInput.current?.click()}
              className="text-3xl bg-gray-100 text-gray-500"
              disabled={isUploading}
            >
              <IoIosAdd />
            </Button>
          </div>

          {/* Voice Recorder Section */}
          <div className="relative ">
            <VoiceRecorder onVoiceRecorded={setRecordedAudio} />
          </div>

          {/* Text Message Section */}
          <form onSubmit={handleSend} className="flex items-center w-full bg-gray-100 rounded">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-grow bg-white px-3 py-1 rounded-lg outline-none"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              disabled={isUploading || isVoiceUploading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />

            <Button
              type="submit"
              disabled={isUploading || isVoiceUploading}
              className="bg-gray-100 ml-2"
            >
              <IoMdSend className="text-3xl text-gray-500 hover:text-blue-600" />
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
