import { Id } from "convex/_generated/dataModel";
import React, { createContext, useContext, useState } from "react";

type Chat = {
  userId: Id<"users">;
  friendId: Id<"users">;
};

type ChatContextType = {
  addFriendButtonClicked: boolean;
  setAddFriendButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  userProfileButtonClicked: boolean;
  setUserProfileButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [addFriendButtonClicked, setAddFriendButtonClicked] = useState(false);
  const [userProfileButtonClicked, setUserProfileButtonClicked] =
    useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  return (
    <ChatContext.Provider
      value={{
        addFriendButtonClicked,
        setAddFriendButtonClicked,
        userProfileButtonClicked,
        setUserProfileButtonClicked,
        currentChat,
        setCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
