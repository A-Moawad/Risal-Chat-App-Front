import AddFriendForm from "@/helper/AddFriendForm";
import Chats from "./Chats";
import UserProfilePage from "@/pages/UserProfilePage";
import { useChat } from "@/contexts/chatContext";

function ChatsSection() {
  const {
    addFriendButtonClicked,
    setAddFriendButtonClicked,
    userProfileButtonClicked,
  } = useChat();
  return (
    <>
      {addFriendButtonClicked ? (
        <AddFriendForm
        />
      ) : userProfileButtonClicked ? (
        <UserProfilePage />
      ) : (
        <Chats />
      )}
    </>
  );
}

export default ChatsSection;
