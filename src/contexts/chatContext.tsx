import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { createContext, useContext, useState, useEffect } from "react";

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
  isArrowLeftClicked: boolean;
  setIsArrowLeftClicked: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  currentUserId: Id<"users"> | null;
  setCurrentUserId: React.Dispatch<React.SetStateAction<Id<"users"> | null>>; // Allow null
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [addFriendButtonClicked, setAddFriendButtonClicked] = useState(false);
  const [userProfileButtonClicked, setUserProfileButtonClicked] =
    useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isArrowLeftClicked, setIsArrowLeftClicked] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentUserId, setCurrentUserId] = useState<Id<"users"> | null>(null);

  const userConvexId = useQuery(
    api.users.getIdByExternalId,
    user?.id ? { externalId: user.id } : "skip"
  );


  return (
    <ChatContext.Provider
      value={{
        addFriendButtonClicked,
        setAddFriendButtonClicked,
        userProfileButtonClicked,
        setUserProfileButtonClicked,
        isArrowLeftClicked,
        setIsArrowLeftClicked,
        currentChat,
        setCurrentChat,
        searchValue,
        setSearchValue,
        currentUserId,
        setCurrentUserId,
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
