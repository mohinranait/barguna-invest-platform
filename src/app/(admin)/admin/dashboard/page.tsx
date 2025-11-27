"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, TrendingUp, BarChart3, PieChartIcon } from "lucide-react";

const monthlyData = [
  { month: "Jan", profit: 50000, expense: 20000 },
  { month: "Feb", profit: 65000, expense: 25000 },
  { month: "Mar", profit: 80000, expense: 30000 },
  { month: "Apr", profit: 90000, expense: 28000 },
  { month: "May", profit: 110000, expense: 35000 },
  { month: "Jun", profit: 130000, expense: 40000 },
];

export default function AdminDashboard() {
  const statsData = [
    {
      id: 1,
      title: "Total Members",
      value: "348",
      subtitle: "+12 new this month",
      subtitleColor: "text-green-600",
      icon: Users,
      iconColor: "text-primary",
    },
    {
      id: 2,
      title: "Total Invested",
      value: "৳ 2,000,000",
      subtitle: "From all members",
      subtitleColor: "text-muted-foreground",
      icon: TrendingUp,
      iconColor: "text-secondary",
    },
    {
      id: 3,
      title: "Profit Distributed",
      value: "৳ 250,000",
      subtitle: "12.5% average return",
      subtitleColor: "text-green-600",
      icon: BarChart3,
      iconColor: "text-primary",
    },
    {
      id: 4,
      title: "Pool Balance",
      value: "৳ 1,750,000",
      subtitle: "Available for investment",
      subtitleColor: "text-muted-foreground",
      icon: PieChartIcon,
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor platform activity and financial metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="p-5 shadow-none gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Icon size={16} className={item.iconColor} />
                {item.title}
              </div>

              <div className="text-2xl font-bold">{item.value}</div>

              <div className={`text-xs mt-2 ${item.subtitleColor}`}>
                {item.subtitle}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profit vs Expense */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Profit vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Bar
                dataKey="profit"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="var(--secondary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Member Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Member Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Active", value: 320 },
                  { name: "Pending KYC", value: 20 },
                  { name: "Inactive", value: 8 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                dataKey="value"
              >
                <Cell fill="var(--primary)" />
                <Cell fill="var(--secondary)" />
                <Cell fill="var(--muted)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted/70 rounded-lg"
            >
              <div>
                <p className="font-medium">Member {i} - Deposit</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">৳ {50000 * i}</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
