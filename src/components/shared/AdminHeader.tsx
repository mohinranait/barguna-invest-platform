import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";

const AdminHeader = () => {
  return (
    <div className=" flex items-center justify-between p-4 border-b border-border">
      <SidebarTrigger />
      <ul className="flex items-center space-x-4">
        <li>
          <div className="mr-4 relative">
            <Bell className="text-primary" size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              4
            </span>
          </div>
        </li>
        <li>
          <ProfileDropdown />
        </li>
      </ul>
    </div>
  );
};

export default AdminHeader;
