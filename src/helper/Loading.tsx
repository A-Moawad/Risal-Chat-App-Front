import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
