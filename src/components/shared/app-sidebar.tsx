"use client";
import { Currency, History, Home, Inbox, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },

  {
    title: "Deposits Requests",
    url: "/admin/deposit-verification",
    icon: Currency,
  },
  {
    title: "Withdraw Requests",
    url: "/admin/withdraw",
    icon: Currency,
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: Users,
  },

  {
    title: "Operations",
    url: "/admin/operations",
    icon: Settings,
  },

  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },

  {
    title: "Reports",
    url: "/admin/reports",
    icon: Inbox,
  },
  {
    title: "KYC Verifications",
    url: "/admin/members/kyc-verification",
    icon: Inbox,
  },

  {
    title: "Historys",
    url: "/admin/audit-log",
    icon: History,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          {open ? (
            <Logo />
          ) : (
            <span className="text-2xl uppercase font-bold text-primary">
              BI
            </span>
          )}
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
