"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

const monthlyData = [
  { month: "Jan", income: 50000, expense: 20000, profit: 30000, members: 280 },
  { month: "Feb", income: 65000, expense: 25000, profit: 40000, members: 295 },
  { month: "Mar", income: 80000, expense: 30000, profit: 50000, members: 310 },
  { month: "Apr", income: 90000, expense: 28000, profit: 62000, members: 320 },
  { month: "May", income: 110000, expense: 35000, profit: 75000, members: 335 },
  { month: "Jun", income: 130000, expense: 40000, profit: 90000, members: 348 },
];

const memberDistribution = [
  { name: "Active", value: 320, color: "var(--primary)" },
  { name: "Pending", value: 20, color: "var(--secondary)" },
  { name: "Inactive", value: 8, color: "var(--muted)" },
];

const investmentBreakdown = [
  { range: "0-10K", count: 85, percent: 24.4 },
  { range: "10-50K", count: 142, percent: 40.8 },
  { range: "50-100K", count: 92, percent: 26.4 },
  { range: "100K+", count: 29, percent: 8.3 },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("monthly");
  const [dateRange, setDateRange] = useState("lastMonth");

  const financeStatsData = [
    {
      id: 1,
      title: "Total Income (6M)",
      value: "৳ 525,000",
      subtitle: "+15% vs previous period",
      subtitleColor: "text-green-600",
      icon: DollarSign,
      iconColor: "text-primary",
    },
    {
      id: 2,
      title: "Total Expenses (6M)",
      value: "৳ 178,000",
      subtitle: "+8% vs previous period",
      subtitleColor: "text-red-600",
      icon: TrendingUp,
      iconColor: "text-secondary",
    },
    {
      id: 3,
      title: "Net Profit (6M)",
      value: "৳ 347,000",
      subtitle: "+18% vs previous period",
      subtitleColor: "text-green-600",
      icon: DollarSign,
      iconColor: "text-green-600",
    },
    {
      id: 4,
      title: "Avg Member Growth",
      value: "+12/mo",
      subtitle: "68 added in 6 months",
      subtitleColor: "text-blue-600",
      icon: Users,
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate and view comprehensive platform reports
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Download size={20} /> Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Report Type
            </label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="annual">Annual Report</option>
              <option value="custom">Custom Period</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="lastMonth">Last Month</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full h-11 bg-transparent">
              <Calendar className="mr-2" size={16} /> Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {financeStatsData.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.id} className="p-6 gap-0">
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
        {/* Income vs Expense Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Income vs Expense Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--destructive)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Profit Margin */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Profit Trend</h2>
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
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Member Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Member Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={memberDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                dataKey="value"
              >
                {memberDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Investment Breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Investment Amount Distribution
          </h2>
          <div className="space-y-4">
            {investmentBreakdown.map((bracket, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {bracket.range} BDT
                  </span>
                  <span className="text-sm font-semibold">
                    {bracket.count} members ({bracket.percent}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${bracket.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Downloadable Reports */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Reports</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
          >
            <FileText size={24} className="text-primary" />
            <span className="text-sm font-medium">Monthly Summary</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
          >
            <FileText size={24} className="text-secondary" />
            <span className="text-sm font-medium">Financial Report</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
          >
            <FileText size={24} className="text-green-600" />
            <span className="text-sm font-medium">Member Activity</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
          >
            <FileText size={24} className="text-blue-600" />
            <span className="text-sm font-medium">Tax Report</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
          >
            <FileText size={24} className="text-orange-600" />
            <span className="text-sm font-medium">Compliance Report</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
          >
            <FileText size={24} className="text-purple-600" />
            <span className="text-sm font-medium">Custom Report</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
