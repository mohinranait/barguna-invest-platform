import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import AdminHeader from "@/components/shared/AdminHeader";
import UserProvider from "@/providers/UserProvider";

type Props = {
  children: React.ReactNode;
};

// Admin layout component that wraps admin pages with sidebar and header
const AdminLayout = ({ children }: Props) => {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className=" w-full relative ">
          <AdminHeader />
          {children}
        </main>
      </SidebarProvider>
    </UserProvider>
  );
};

export default AdminLayout;
