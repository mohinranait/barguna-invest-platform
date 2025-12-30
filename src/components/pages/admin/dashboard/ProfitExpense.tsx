"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ProfitExpense = () => {
  const monthlyData = [
    { month: "Jan", profit: 50000, expense: 20000 },
    { month: "Feb", profit: 65000, expense: 25000 },
    { month: "Mar", profit: 80000, expense: 30000 },
    { month: "Apr", profit: 90000, expense: 28000 },
    { month: "May", profit: 110000, expense: 35000 },
    { month: "Jun", profit: 130000, expense: 40000 },
  ];

  return (
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
          <Bar dataKey="profit" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          <Bar
            dataKey="expense"
            fill="var(--secondary)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProfitExpense;
