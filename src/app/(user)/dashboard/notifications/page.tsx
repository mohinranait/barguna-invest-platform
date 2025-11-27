"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Trash2,
} from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

const notifications = [
  {
    id: 1,
    type: "profit",
    title: "Profit Distribution",
    message: "You earned ৳ 1,250 from monthly profit distribution",
    date: "Dec 1, 2024",
    read: false,
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "deposit",
    title: "Deposit Confirmed",
    message: "Your deposit of ৳ 5,000 has been successfully confirmed",
    date: "Nov 28, 2024",
    read: true,
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "withdrawal",
    title: "Withdrawal Status",
    message: "Your withdrawal request of ৳ 3,000 has been approved",
    date: "Nov 25, 2024",
    read: true,
    icon: CheckCircle,
  },
  {
    id: 4,
    type: "alert",
    title: "KYC Verification Pending",
    message:
      "Your KYC verification is pending. Please upload documents to proceed",
    date: "Nov 20, 2024",
    read: false,
    icon: AlertCircle,
  },
  {
    id: 5,
    type: "deposit",
    title: "Deposit Confirmed",
    message: "Your deposit of ৳ 10,000 has been successfully confirmed",
    date: "Nov 15, 2024",
    read: true,
    icon: CheckCircle,
  },
];

export default function NotificationsPage() {
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);
  const [filter, setFilter] = useState("all");

  const handleFilter = (type: string) => {
    setFilter(type);
    if (type === "all") {
      setFilteredNotifications(notifications);
    } else if (type === "unread") {
      setFilteredNotifications(notifications.filter((n) => !n.read));
    } else {
      setFilteredNotifications(notifications.filter((n) => n.type === type));
    }
  };

  const handleDelete = (id: number) => {
    setFilteredNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "profit":
        return "bg-green-50 border-green-200";
      case "deposit":
        return "bg-blue-50 border-blue-200";
      case "withdrawal":
        return "bg-purple-50 border-purple-200";
      case "alert":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-muted/30 border-border";
    }
  };

  return (
    <React.Fragment>
      <UserContainer className="pt-4 pb-8">
        <UserHeader />
        <div className="space-y-5 pt-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground mt-1">
                Stay updated with your account activity
              </p>
            </div>
            <div className="relative">
              <Bell className="text-primary" size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter((n) => !n.read).length}
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => handleFilter("all")}
              className={
                filter === "all" ? "bg-primary hover:bg-primary/90" : ""
              }
            >
              All Notifications
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => handleFilter("unread")}
              className={
                filter === "unread" ? "bg-primary hover:bg-primary/90" : ""
              }
            >
              Unread
            </Button>
            <Button
              variant={filter === "profit" ? "default" : "outline"}
              onClick={() => handleFilter("profit")}
              className={
                filter === "profit" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              Profits
            </Button>
            <Button
              variant={filter === "deposit" ? "default" : "outline"}
              onClick={() => handleFilter("deposit")}
              className={
                filter === "deposit" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              Deposits
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`p-4 border-2 transition hover:shadow-md ${getNotificationColor(
                      notification.type
                    )} ${!notification.read ? "border-l-4" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center">
                <Bell
                  className="mx-auto text-muted-foreground mb-4"
                  size={32}
                />
                <p className="text-muted-foreground">No notifications</p>
              </Card>
            )}
          </div>

          {/* Notification Settings */}
          <Card className="p-6 bg-secondary/5 border-secondary/20">
            <h2 className="text-lg font-semibold mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                { label: "Profit Distribution Notifications", value: true },
                { label: "Deposit & Withdrawal Alerts", value: true },
                { label: "KYC Status Updates", value: false },
                { label: "Monthly Statements", value: true },
                { label: "Administrative Announcements", value: true },
              ].map((pref, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-card rounded"
                >
                  <label className="text-sm font-medium">{pref.label}</label>
                  <input
                    type="checkbox"
                    defaultChecked={pref.value}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <Button className="mt-6 bg-primary hover:bg-primary/90">
              Save Preferences
            </Button>
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
