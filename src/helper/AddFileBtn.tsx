import React, { useRef, useState, FormEvent } from "react";
import { IoIosAdd } from "react-icons/io";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";

type MessageType = {
  senderId: Id<"users">;
  conversationId: Id<"conversations"> | null;
};
function AddFileBtn({ senderId, conversationId }: MessageType) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const handleSendImage = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedImage) return;

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      const { storageId } = json;

      // Step 3: Save the newly allocated storage id to the database
      await sendImage({
        storageId,
        senderId,
        conversationId,
      });

      toast("Image sent successfully!");
      setSelectedImage(null); // Reset the selected image
    } catch (error) {
      console.error("Error sending image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSendImage} className="flex items-center">
      <input
        title="upload image"
        placeholder="upload image"
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
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
      {selectedImage && (
        <div className="flex items-center space-x-2">
          <p className="text-sm">{selectedImage.name}</p>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Send Image"}
          </button>
        </div>
      )}
    </form>
  );
}

export default AddFileBtn;
