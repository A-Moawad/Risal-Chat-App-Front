import { IoMdMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@/contexts/chatContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useEffect, useState } from "react";

const UserMoreOptions = () => {
  const { user } = useUser();
  const { setUserProfileButtonClicked, currentUserId, setCurrentUserId } =
    useChat();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Convex User ID
  const userConvexId = useQuery(
    api.users.getIdByExternalId,
    user?.id ? { externalId: user.id } : "skip"
  );

  useEffect(() => {
    if (userConvexId) {
      setCurrentUserId(userConvexId);
    }
  }, [userConvexId, setCurrentUserId]);

  const deleteCurrentUserConvex = useMutation(api.users.deletCurrentUser);
  const deleteCurrentUserConversations = useMutation(
    api.conversations.deleteUserConversations
  );
  const deleteCurrentUserMessages = useMutation(
    api.messages.deleteMessagesByUserId
  );

  const handleUserProfileBtnClick = () => {
    setUserProfileButtonClicked(true);
  };

  const handleDeleteUserBtn = async () => {
    if (!user) {
      toast.error("Failed to delete user: User not found.");
      return;
    }

    if (!currentUserId) {
      toast.error("Failed to delete user: User ID not found.");
      return;
    }

    if (isDeleting) return; // Prevent multiple clicks

    setIsDeleting(true); // Set loading state

    try {
      // Delete all messages for the current user in all conversations
      await deleteCurrentUserMessages({
        userId: currentUserId as Id<"users">,
      });

      await deleteCurrentUserConversations({
        user1: currentUserId as Id<"users">,
      });

      // Delete the current user from Convex
      await deleteCurrentUserConvex();

      <div className="bg-green-500 text-white text-sm w-full px-4 py-3 rounded-md">
        toast.success("User deleted successfully.");
      </div>;
    } catch (error) {
      <div className="bg-red-500 text-white text-sm w-full  py-3 px-4 rounded-md">
        toast.error("Failed to delete user. Please try again.");
      </div>;
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Tooltip>
            <TooltipTrigger>
              <IoMdMore
                className="cursor-pointer text-2xl"
                aria-label="More Options"
              />
            </TooltipTrigger>
            <TooltipContent className="w-auto px-3 py-2 flex items-center justify-center border border-gray-300 bg-white rounded">
              <p className="text-xs text-gray-700 text-center leading-tight">
                More
              </p>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>User Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleUserProfileBtnClick}
          >
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <SignOutButton />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onClick={handleDeleteUserBtn}
            disabled={isDeleting} // Disable button while deleting
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default UserMoreOptions;
