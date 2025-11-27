"use client";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import StatusBadge from "@/components/ui/status-badge";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

const UserDashboard = () => {
  const user: { profitEarned: number } = { profitEarned: 1000 }; // Replace with actual user data fetching logic
  const [transactions] = useState<Transaction[]>([]);
  const profitData = [
    { month: "Jan", profit: user?.profitEarned ? user.profitEarned * 0.3 : 0 },
    { month: "Feb", profit: user?.profitEarned ? user.profitEarned * 0.4 : 0 },
    { month: "Mar", profit: user?.profitEarned ? user.profitEarned * 0.5 : 0 },
    { month: "Apr", profit: user?.profitEarned ? user.profitEarned * 0.6 : 0 },
    { month: "May", profit: user?.profitEarned ? user.profitEarned * 0.7 : 0 },
    { month: "Jun", profit: user?.profitEarned ? user.profitEarned : 0 },
  ];

  return (
    <React.Fragment>
      <div className="bg-green-700 pt-4 pb-6 ">
        <UserContainer>
          <UserHeader />
          <div className="flex items-center pt-4 justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome Back, Mahir</h1>
              <p className="text-muted-foreground">
                Here is your investment overview
              </p>
            </div>
            <Link href="/dashboard/deposits">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus size={20} /> Deposit
              </Button>
            </Link>
          </div>
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 pt-4 gap-6">
            <StatCard
              icon={<TrendingDown className="text-primary" size={24} />}
              label="Total Invested"
              value={`৳ ${(1000).toLocaleString()}`}
            />
            <StatCard
              icon={<TrendingUp className="text-primary" size={24} />}
              label="Total Profit Earned"
              value={`৳ ${(200).toLocaleString()}`}
              change="+12.5%"
              changeType="positive"
            />
            <StatCard
              icon={<TrendingUp className="text-primary" size={24} />}
              label="Current Balance"
              value={`৳ ${(100).toLocaleString()}`}
            />
            <StatCard
              icon={<TrendingUp className="text-primary" size={24} />}
              label="Pool Share"
              value={"0%"}
            />
          </div>
        </UserContainer>
      </div>

      <div>
        <UserContainer className="space-y-5 pt-5 pb-8">
          {/* Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profit Trend */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Profit Trend (6 Months)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: "var(--primary)", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Distribution Pie */}
            <Card className="p-6 flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-4">Your Share</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Your Investment", value: 50 },
                      { name: "Others", value: 50 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    <Cell fill="var(--primary)" />
                    <Cell fill="var(--muted)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <div className="text-2xl font-bold">0.5%</div>
                <div className="text-xs text-muted-foreground">Pool Share</div>
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-muted-foreground"
                      >
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr
                        key={txn._id}
                        className="border-b hover:bg-muted/50 transition"
                      >
                        <td className="py-3">{txn.type}</td>
                        <td className="py-3 font-semibold">
                          ৳ {txn.amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <StatusBadge
                            status={
                              txn.type === "deposit" ? "success" : "error"
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </UserContainer>
      </div>
    </React.Fragment>
  );
};

export default UserDashboard;
