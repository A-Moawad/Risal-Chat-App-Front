import React from "react";
import avatar from "../assets/images/avatar.png";


function UserProfilePage() {

  return (
    <div className="bg-white w-full sm:w-[50%] lg:w-[40%] h-[100vh]  flex flex-col gap-4 px-3 py-3 rounded-md sm:rounded-r-none">
      <h1 className="text-2xl font-bold ">User Profile </h1>
      <div className="flex gap-4">
        <img
          src={avatar}
          alt="Profile avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <h2 className="font-bold ">Ahmed Mohamed</h2>
      </div>
    </div>
  );
}

export default UserProfilePage;
