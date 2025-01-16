import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function ChatMessageSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4  w-[100%]">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`${
              index % 2 === 0 ? "bg-gray-200" : "bg-blue-400"
            } rounded-xl p-3`}
            
          >
            <Skeleton className="h-2 w-[200px] mb-2" />
            <Skeleton className="h-2 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatMessageSkeleton;
