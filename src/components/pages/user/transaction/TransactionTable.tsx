"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ITransaction } from "@/types/transaction.type";
import { format } from "date-fns";
import { Download } from "lucide-react";
import React from "react";

type Props = {
  historys: ITransaction[];
};
const TransactionTable = ({ historys }: Props) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      {historys.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No transactions found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-border text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 pl-3 text-left">Date</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {historys.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b hover:bg-muted/30 transition"
                >
                  <td className="py-3 pl-3">
                    {format(new Date(inv.createdAt), "MMM dd, yyyy")}
                    <p className="text-xs">
                      {format(new Date(inv.createdAt), "hh:mm a")}{" "}
                    </p>
                  </td>

                  <td className="py-3 capitalize">{inv.type}</td>

                  <td
                    className={cn(
                      "py-3 font-semibold",
                      inv.type === "deposit" || inv.type === "profit"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {inv.type === "withdraw" ? "-" : "+"}৳{" "}
                    {inv.amount.toLocaleString()}
                  </td>

                  <td className="py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
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
  );
};

export default TransactionTable;
