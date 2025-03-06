import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { uploadFile } from "@/utils/uploadFile";

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

  const sendTextMessage = async (message: string) => {
    if (!conversationId || !senderId) return;
    try {
      await sendMessage({
        senderId: senderId as Id<"users">,
        conversationId,
        content: message,
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const sendImageMessage = async (selectedImage: File) => {
    if (!conversationId || !senderId) return;
    try {
        setIsUploading(true);
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage!.type },
          body: selectedImage,
        })
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        const { storageId } = json;
        await sendImageMessage(selectedImage);
      toast.error("Error sending image");
    } catch (error) {
      toast.error("Error sending image");
    }
    finally {
      setIsUploading(false);
    }
  };

  // const sendVoiceMessage = async (audioBlob: Blob) => {
  //   if (!conversationId || !senderId) return;
  //   try {
  //     setIsVoiceUploading(true);
  //     const postUrl = await generateUploadUrl();
  //     const result = await fetch(postUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "audio/webm" },
  //       body: audioBlob,
  //     });
  //     const json = await result.json();
  //     if (!result.ok) throw new Error(`Upload failed: ${JSON.stringify(json)}`);
  //     await sendVoice({
  //       storageId: json.storageId,
  //       senderId: senderId as Id<"users">,
  //       conversationId,
  //     });
  //     toast.success("Voice message sent successfully!");
  //   } catch (error) {
  //     toast.error("Error sending voice message");
  //   } finally {
  //     setIsVoiceUploading(false);
  //   }
  // };

  return {
    sendTextMessage,
    sendImageMessage,
    // sendVoiceMessage,
    isUploading,
    setIsUploading
    // isVoiceUploading,
  };
}
