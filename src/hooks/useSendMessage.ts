import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";

export function useSendMessage(
  conversationId: Id<"conversations"> | null,
  senderId: Id<"users"> | null
) {
  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const sendVoice = useMutation(api.messages.sendVoice);

  const [isUploading, setIsUploading] = useState(false);
  const [isVoiceUploading, setIsVoiceUploading] = useState(false);

  // Send text message
  const sendTextMessage = async (message: string) => {
    if (!conversationId || !senderId) return;
    try {
      await sendMessage({
        senderId: senderId as Id<"users">,
        conversationId,
        content: message,
      });
    } catch (error) {
      toast.error("Error sending text message", {
        duration: 3000,
        position: "top-right",
        className: "bg-red-500 text-white font-semibold",
      });
    }
  };

  // Send image message
  const sendImageMessage = async (selectedImage: File) => {
    if (!conversationId || !senderId) return;
    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
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
        senderId: senderId as Id<"users">,
        conversationId,
      });

      toast.success("Image sent successfully!", {
        duration: 3000,
        position: "top-right",
        className: "bg-green-500 text-white font-semibold",
      });
    } catch (error) {
      toast.error("Error sending image", {
        duration: 3000,
        position: "top-right",
        className: "bg-red-500 text-white font-semibold",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // send voice message
  const sendVoiceMessage = async (audioBlob: Blob) => {
    if (!conversationId || !senderId) return;
    try {
      setIsVoiceUploading(true);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        // headers: { "Content-Type": "audio/webm" },
        headers: { "Content-Type": "audio/wav" },
        body: audioBlob,
      });

      const json = await result.json();
      if (!result.ok) throw new Error(`Upload failed: ${JSON.stringify(json)}`);

      await sendVoice({ storageId: json.storageId, senderId, conversationId });

      toast.success("Voice message sent!");
    } catch (error) {
      toast.error("Error sending voice message");
    } finally {
      setIsVoiceUploading(false);
    }
  };

  return {
    sendTextMessage,
    sendImageMessage,
    sendVoiceMessage,
    isVoiceUploading,
    setIsVoiceUploading,
    isUploading,
    setIsUploading,
  };
}
