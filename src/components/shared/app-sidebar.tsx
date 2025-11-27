import {
  Calendar,
  Currency,
  History,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
    title: "Members",
    url: "/admin/members",
    icon: Users,
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
    title: "Historys",
    url: "/admin/audit-log",
    icon: History,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
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
