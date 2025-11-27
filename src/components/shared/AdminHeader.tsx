import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { User } from "lucide-react";

const AdminHeader = () => {
  return (
    <div className=" flex items-center justify-between p-4 border-b border-border">
      <SidebarTrigger />
      <ul>
        <li>
          <div>
            <User />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AdminHeader;
