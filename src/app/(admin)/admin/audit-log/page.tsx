"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Eye } from "lucide-react";

const auditLog = [
  {
    id: 1,
    admin: "Admin User",
    action: "Profit Distribution",
    target: "৳ 50,000 to 5 members",
    timestamp: "Dec 1, 2024 10:30 AM",
    status: "Success",
  },
  {
    id: 2,
    admin: "Admin User",
    action: "Member Approved",
    target: "Ahmed Rahman (MEM-001)",
    timestamp: "Nov 30, 2024 3:45 PM",
    status: "Success",
  },
  {
    id: 3,
    admin: "Admin User",
    action: "KYC Verified",
    target: "Fatima Khan (MEM-002)",
    timestamp: "Nov 30, 2024 2:15 PM",
    status: "Success",
  },
  {
    id: 4,
    admin: "Admin User",
    action: "Withdrawal Processed",
    target: "৳ 5,000 for Rahman Ahmed",
    timestamp: "Nov 29, 2024 11:20 AM",
    status: "Success",
  },
  {
    id: 5,
    admin: "Admin User",
    action: "Business Income Added",
    target: "৳ 75,000 (Sales Revenue)",
    timestamp: "Nov 28, 2024 9:00 AM",
    status: "Success",
  },
  {
    id: 6,
    admin: "Admin User",
    action: "Member Suspended",
    target: "Sara Islam (MEM-005)",
    timestamp: "Nov 27, 2024 4:30 PM",
    status: "Completed",
  },
  {
    id: 7,
    admin: "Admin User",
    action: "Settings Updated",
    target: "Platform fees configuration",
    timestamp: "Nov 26, 2024 2:00 PM",
    status: "Success",
  },
];

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLog = auditLog.filter((log) => {
    const matchesSearch =
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    if (actionFilter === "all") return matchesSearch;
    return matchesSearch && log.action === actionFilter;
  });

  const uniqueActions = [...new Set(auditLog.map((log) => log.action))];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground mt-1">
            Track all administrative actions and system activities
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Download size={20} /> Export Log
        </Button>
      </div>

      {/* Log Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Total Actions
          </div>
          <div className="text-3xl font-bold">{auditLog.length}</div>
          <div className="text-xs text-muted-foreground mt-2">This month</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Successful
          </div>
          <div className="text-3xl font-bold">
            {auditLog.filter((l) => l.status === "Success").length}
          </div>
          <div className="text-xs text-green-600 mt-2">No errors</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Admin Users
          </div>
          <div className="text-3xl font-bold">1</div>
          <div className="text-xs text-muted-foreground mt-2">Active</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Last Action
          </div>
          <div className="text-lg font-bold">10:30 AM</div>
          <div className="text-xs text-muted-foreground mt-2">
            Profit Distribution
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Actions
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Search by admin, action, or target..."
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Action Type
            </label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full h-11 gap-2 bg-transparent"
            >
              <Filter size={20} /> More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Time
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Admin
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Action
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Target
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLog.map((log) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-muted/50 transition"
                >
                  <td className="py-3 text-muted-foreground text-xs">
                    {log.timestamp}
                  </td>
                  <td className="py-3 font-medium">{log.admin}</td>
                  <td className="py-3">{log.action}</td>
                  <td className="py-3 text-muted-foreground">{log.target}</td>
                  <td className="py-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLog.length} of {auditLog.length} entries
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">1</Button>
          <Button className="bg-primary hover:bg-primary/90">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}
