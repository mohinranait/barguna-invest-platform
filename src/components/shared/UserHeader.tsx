"use client";
import {
  Bell,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  TrendingUp,
  User,
} from "lucide-react";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const memberNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Deposits", href: "/dashboard/deposits", icon: CreditCard },
  { label: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { label: "Withdrawals", href: "/dashboard/withdrawals", icon: LogOut },
  // { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Statements", href: "/dashboard/statements", icon: FileText },
];

const UserHeader = () => {
  const pathName = usePathname();
  return (
    <div className="px-6 rounded-4xl max-w-4xl mx-auto border border-border flex items-center justify-between h-14 bg-background   top-4 left-0 right-0">
      <div className="lg:hidden">
        <Drawer direction="left">
          <DrawerTrigger>
            {" "}
            <Menu className="cursor-pointer lg:hidden" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <ul className="w-full flex flex-col gap-2 mt-4 px-5">
              {memberNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${item?.href}`}
                    className="py-2 w-full inline-flex px-2 rounded hover:bg-gray-300"
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            </ul>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <ul className="hidden w-full lg:flex  gap-1  ">
        {memberNavItems.map((item) => (
          <li key={item.href}>
            <Link
              href={`${item?.href}`}
              className={cn(
                "py-1 w-full inline-flex px-2 text-sm font-medium text-foreground rounded hover:bg-primary hover:text-white",
                pathName === item.href ? "bg-primary text-white" : ""
              )}
            >
              {item?.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 items-center">
        <Link href={"/dashboard/notifications"} className="mr-4 relative">
          <Bell className="text-primary" size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            4
          </span>
        </Link>
        <span>
          <User />
        </span>
      </div>
    </div>
  );
};

export default UserHeader;
