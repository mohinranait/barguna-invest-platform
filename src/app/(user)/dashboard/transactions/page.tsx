"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { ITransaction } from "@/types/transaction.type";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function InvestmentsPage() {
  const [historys, setHistorys] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistorys();
  }, []);

  const fetchHistorys = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/member/transactions", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setHistorys(data.transactions);
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setLoading(false);
    }
  };

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
          <Card className="p-6 gap-4">
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
            {loading ? (
              <LoadingSpinner />
            ) : historys?.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500">No deposits yet</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-border text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left min-w-[120px] py-3 pl-3 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left min-w-20 py-3 font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="text-left min-w-20 py-3 font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-left min-w-20 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historys.map((inv) => (
                      <tr
                        key={inv._id}
                        className="border-b hover:bg-muted/50 transition"
                      >
                        <td className="py-3 pl-3">
                          {format(new Date(), "MMM ddd, yyyy")}
                        </td>
                        <td className="py-3 capitalize">{inv.type}</td>
                        <td
                          className={cn(
                            "py-3 font-semibold",
                            inv.type === "deposit"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {inv.type === "deposit" ? "+" : "-"}৳{" "}
                          {inv.amount?.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
