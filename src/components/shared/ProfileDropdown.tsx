"use client";
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
import { History, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/providers/UserProvider";
import { Skeleton } from "../ui/skeleton";

const ProfileDropdown = () => {
  const { user, userLoading } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {userLoading ? (
          <Skeleton className="w-24 h-6 rounded-md" />
        ) : (
          <div className="inline-flex cursor-pointer  items-center gap-1">
            <User /> {user?.fullName}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
          <DropdownMenuItem>
            <LayoutDashboard /> Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href={"/dashboard/profile"}>
          <DropdownMenuItem>
            <User /> Profile
          </DropdownMenuItem>
        </Link>
        <Link href={"/dashboard/transactions"}>
          <DropdownMenuItem>
            <History /> Transactions History
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
