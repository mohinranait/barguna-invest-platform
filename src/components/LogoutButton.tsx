"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Props = {
  children?: React.ReactNode;
  className?: string;
};
// Logout button component
const LogoutButton = ({ children, className }: Props) => {
  const router = useRouter();
  const handleLogout = async () => {
    console.log("Clicked");

    const res = await fetch(`/api/auth/logout`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.success) {
      router.push("/login");
    }
  };
  return (
    <button
      onClick={() => handleLogout()}
      type="button"
      className={cn("p-0 bg-transparent", className)}
    >
      {children ? children : "Logout"}
    </button>
  );
};

export default LogoutButton;
