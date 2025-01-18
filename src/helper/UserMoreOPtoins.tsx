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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserMoreOptions = () => {
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
            <TooltipContent className="w-auto  px-3 py-2 flex items-center justify-center border border-gray-300 bg-white rounded">
              <p className="text-xs text-gray-700 text-center leading-tight ">
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
            onClick={() => alert("View Profile")}
          >
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default UserMoreOptions;
