"use client";
import TransactionTable from "@/components/pages/user/transaction/TransactionTable";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/ui/stat-card";
import { useUser } from "@/providers/UserProvider";
import { ITransaction } from "@/types/transaction.type";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

const UserDashboard = () => {
  const { user, userLoading } = useUser();

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const profitData = [
    { month: "Jan", profit: user?.profitEarned ? user.profitEarned * 0.3 : 0 },
    { month: "Feb", profit: user?.profitEarned ? user.profitEarned * 0.4 : 0 },
    { month: "Mar", profit: user?.profitEarned ? user.profitEarned * 0.5 : 0 },
    { month: "Apr", profit: user?.profitEarned ? user.profitEarned * 0.6 : 0 },
    { month: "May", profit: user?.profitEarned ? user.profitEarned * 0.7 : 0 },
    { month: "Jun", profit: user?.profitEarned ? user.profitEarned : 0 },
  ];

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/member/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <React.Fragment>
      <div className="bg-green-800 pt-4 pb-6 ">
        <UserContainer>
          <UserHeader />
          <div className="flex items-center flex-wrap gap-3 pt-4 justify-between">
            <div>
              <h1 className="text-3xl text-white font-bold">
                Welcome Back, {user?.fullName}
              </h1>
              <p className="text-accent">Here is your investment overview</p>
            </div>
            <Link href="/dashboard/deposits">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus size={20} /> Deposit
              </Button>
            </Link>
          </div>
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 pt-4 gap-4 lg:gap-6">
            {userLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 gap-0 backdrop-blur-3xl">
                    {/* Icon + Label */}
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Value */}
                    <Skeleton className="h-8 w-40 mb-2" />

                    {/* Change */}
                    <Skeleton className="h-3 w-20" />
                  </Card>
                ))}
              </>
            ) : (
              <>
                <StatCard
                  icon={<TrendingUp className="text-primary" size={18} />}
                  label="Current Balance"
                  value={`৳ ${user?.balance.toLocaleString()}`}
                />

                <StatCard
                  icon={<TrendingDown className="text-primary" size={18} />}
                  label="Total Invested"
                  value={`৳ ${user?.investedAmount.toLocaleString()}`}
                />
                <StatCard
                  icon={<TrendingUp className="text-primary" size={18} />}
                  label="Total Profit Earned"
                  value={`৳ ${user?.profitEarned.toLocaleString()}`}
                  change="+12.5%"
                  changeType="positive"
                />
              </>
            )}
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
          <TransactionTable historys={transactions} />
        </UserContainer>
      </div>
    </React.Fragment>
  );
};

export default UserDashboard;
