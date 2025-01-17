import { IoMdMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/clerk-react";

const UserMoreOptions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IoMdMore
          className="cursor-pointer text-2xl"
          aria-label="More Options"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>User Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => alert("View Profile")}
        >
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMoreOptions;
