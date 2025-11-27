import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "../LogoutButton";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";

const ProfileDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span>
          <User />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={"/dashboard"}>
          <DropdownMenuItem>
            <LayoutDashboard /> Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href={"/dashboard/profile"}>
          <DropdownMenuItem>
            <User /> Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <LogoutButton className="w-full ">
          <DropdownMenuItem className="cursor-pointer">
            <LogOut /> Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
