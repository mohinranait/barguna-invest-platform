import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import AdminHeader from "@/components/shared/AdminHeader";
import UserProvider from "@/providers/UserProvider";

type Props = {
  children: React.ReactNode;
};
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
