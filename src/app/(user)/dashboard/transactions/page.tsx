"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import React, { useState } from "react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

const investments = [
  {
    id: 1,
    date: "Dec 1, 2024",
    amount: "10,000",
    type: "Initial Deposit",
    status: "Completed",
  },
  {
    id: 2,
    date: "Nov 15, 2024",
    amount: "5,000",
    type: "Additional Deposit",
    status: "Completed",
  },
];

export default function InvestmentsPage() {
  const [historys, setHistorys] = useState([]);
  return (
    <React.Fragment>
      <UserContainer className="pt-4">
        <UserHeader />
        <div className=" space-y-6 pt-4">
          <div>
            <h1 className="text-3xl font-bold">Investment & Profit History</h1>
            <p className="text-muted-foreground mt-1">
              View all your investments and profits
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date Range
                </label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                  <option>All Types</option>
                  <option>Deposit</option>
                  <option>Profit</option>
                  <option>Withdrawal</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between ">
              <h2 className="text-lg font-semibold">Transactions</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Download size={16} /> Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-border text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pl-3 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b hover:bg-muted/50 transition"
                    >
                      <td className="py-3 pl-3">{inv.date}</td>
                      <td className="py-3">{inv.type}</td>
                      <td className="py-3 font-semibold">৳ {inv.amount}</td>
                      <td className="py-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
