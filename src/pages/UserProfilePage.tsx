import React from "react";
import avatar from "../assets/images/avatar.png";
import { GoArrowLeft } from "react-icons/go";
import { useChat } from "@/contexts/chatContext";
import { useUser } from "@clerk/clerk-react";


function UserProfilePage() {
  const { setUserProfileButtonClicked } = useChat();
  const { user } = useUser();

  const handleArrowLeftClick = () => {
    setUserProfileButtonClicked(false);
  };


  return (
    <section className="bg-white w-full sm:w-[50%] lg:w-[40%] h-[100vh] px-6 py-8 flex flex-col gap-6 shadow-lg rounded-md sm:rounded-r-none">
      {/* Header */}
      <div className="flex items-center gap-4">
        <GoArrowLeft
          className="text-xl text-gray-600 cursor-pointer"
          onClick={handleArrowLeftClick}
          aria-label="Go back"
        />
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      {/* User Information */}
      <div className="flex items-center gap-4">
        <img
          src={user?.imageUrl}
          alt="Profile avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <h2 className="font-bold text-lg">{user?.firstName}</h2>
      </div>

      {/* update picture  */}
      
    </section>
  );
}

export default UserProfilePage;
