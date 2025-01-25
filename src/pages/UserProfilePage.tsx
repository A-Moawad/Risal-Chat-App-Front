import React, { useState, useRef, FormEvent, useCallback } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useChat } from "@/contexts/chatContext";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

function UserProfilePage() {
  const { setUserProfileButtonClicked } = useChat();
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfileImage = useMutation(api.users.updateProfileImage);
  const avatarUrl = useQuery(api.users.getProfileImage);

  const handleArrowLeftClick = useCallback(() => {
    setUserProfileButtonClicked(false);
  }, [setUserProfileButtonClicked]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        alert("File size must be 5MB or less.");
      }
    },
    []
  );

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const ProfileImageUrl = await generateUploadUrl();
      const response = await fetch(ProfileImageUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });

      if (!response.ok) throw new Error("Failed to upload image.");

      const { storageId } = await response.json();
      await updateProfileImage({ storageId });

      setSelectedImage(null);
      setPreviewUrl(undefined);
    } catch (err) {
      console.log("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-white w-full sm:w-[50%] lg:w-[40%] h-[100vh] py-8 flex flex-col gap-6 shadow-lg rounded-md sm:rounded-r-none">
      <div className="flex items-center gap-4 px-6">
        <GoArrowLeft
          className="text-xl text-gray-600 cursor-pointer"
          onClick={handleArrowLeftClick}
          aria-label="Go back"
        />
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      <div className="flex items-center gap-4 px-6">
        <Image url={avatarUrl || undefined} />
        <h2 className="font-bold text-lg">{user?.firstName || "User"}</h2>
      </div>

      <form
        onSubmit={handleUpload}
        className="grid w-full items-center gap-4 px-auto"
      >
        <div className="flex flex-col items-center gap-4 bg-gray-100 h-[200px]">
          <label
            htmlFor="picture"
            className="flex items-center rounded-full border border-gray-600 h-[150px] w-[150px] bg-gray-200 justify-center px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-[150px] w-[150px] rounded-full object-cover"
              />
            ) : (
              "Add Profile Photo"
            )}
          </label>
          <input
            id="picture"
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </section>
  );
}

export default UserProfilePage;

function Image({ url }: { url: string | undefined }) {
  if (!url) {
    return <div className="w-[50px] h-[50px] bg-gray-300 rounded-full"></div>;
  }
  return (
    <img
      title="profile image"
      src={url}
      height="50px"
      width="50px"
      alt="user profile image"
      className="rounded-full"
    />
  );
}
