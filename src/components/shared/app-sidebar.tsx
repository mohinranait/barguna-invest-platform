"use client";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  History,
  Home,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

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
    title: "Deposit Requests",
    url: "/admin/deposit-verification",
    icon: ArrowDownToLine,
  },
  {
    title: "Withdraw Requests",
    url: "/admin/withdraw",
    icon: ArrowUpFromLine,
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
    title: "Distribution",
    url: "/admin/distribution",
    icon: Wallet,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "KYC Verifications",
    url: "/admin/members/kyc-verification",
    icon: ShieldCheck,
  },
  {
    title: "History",
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
