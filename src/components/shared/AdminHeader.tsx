import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { connectDB } from "@/lib/db";
import { CompanyWallet } from "@/models/CompanyWallet.model";
import { IWallet } from "@/types/wallet.type";

const AdminHeader = async () => {
  await connectDB();
  const getWallet = await CompanyWallet.findOne({});
  const wallet: IWallet = JSON.parse(JSON.stringify(getWallet));
  return (
    <div className=" top-0 sticky z-10 bg-white flex items-center justify-between p-4 border-b border-border">
      <SidebarTrigger />
      <ul className="flex items-center space-x-4">
        <li className="rounded-3xl py-2 px-3 bg-primary/10 text-primary border border-primary/20 font-medium">
          Balance:{" "}
          <span className="font-semibold">
            ৳ {wallet.totalBalance?.toFixed(2).toLocaleString()}
          </span>
        </li>
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
