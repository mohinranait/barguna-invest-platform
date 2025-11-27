"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import React from "react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

const statements = [
  {
    month: "December 2024",
    date: "Dec 1, 2024",
    transactions: 12,
    profit: "1,250",
    status: "Ready",
  },
  {
    month: "November 2024",
    date: "Nov 1, 2024",
    transactions: 15,
    profit: "1,100",
    status: "Ready",
  },
  {
    month: "October 2024",
    date: "Oct 1, 2024",
    transactions: 10,
    profit: "950",
    status: "Ready",
  },
  {
    month: "September 2024",
    date: "Sep 1, 2024",
    transactions: 18,
    profit: "1,300",
    status: "Ready",
  },
];

export default function StatementsPage() {
  return (
    <React.Fragment>
      <UserContainer className="pt-4 pb-8">
        <UserHeader />
        <div className=" space-y-5 pt-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Monthly Statements</h1>
            <p className="text-muted-foreground ">
              Download and view your monthly investment statements
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Statements
              </div>
              <div className="text-3xl font-bold">{statements.length}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Available for download
              </div>
            </Card>
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Current Month Profit
              </div>
              <div className="text-3xl font-bold">৳ {statements[0].profit}</div>
              <div className="text-xs text-green-600 mt-2">
                From {statements[0].transactions} transactions
              </div>
            </Card>
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Profit (YTD)
              </div>
              <div className="text-3xl font-bold">৳ 4,600</div>
              <div className="text-xs text-muted-foreground mt-2">
                Year to date earnings
              </div>
            </Card>
          </div>

          {/* Statements List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Available Statements</h2>
            <div className="space-y-3">
              {statements.map((stmt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition border"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">{stmt.month}</p>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="inline mr-1" size={14} />
                        {stmt.date} • {stmt.transactions} transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ৳ {stmt.profit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stmt.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Download size={16} /> PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Statement Preview */}
          <Card className="p-8 border-2 border-primary/20 bg-primary/5">
            <h2 className="text-lg font-semibold mb-4">Statement Preview</h2>
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-4 border-b">
                <h3 className="text-xl font-bold">
                  Barguna Investment Platform
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monthly Statement - December 2024
                </p>
              </div>

              {/* Member Info */}
              <div className="grid md:grid-cols-2 gap-6 py-4 border-b">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    MEMBER DETAILS
                  </p>
                  <p className="font-semibold">Ahmed Rahman</p>
                  <p className="text-sm text-muted-foreground">
                    Member ID: MEM-001
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: ahmed@example.com
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    STATEMENT PERIOD
                  </p>
                  <p className="font-semibold">December 1 - 31, 2024</p>
                  <p className="text-sm text-muted-foreground">
                    Generated: Dec 1, 2024
                  </p>
                </div>
              </div>

              {/* Account Summary */}
              <div className="grid md:grid-cols-4 gap-4 py-4">
                <div className="p-3 bg-card rounded">
                  <p className="text-xs text-muted-foreground mb-1">
                    Opening Balance
                  </p>
                  <p className="font-bold text-lg">৳ 10,000</p>
                </div>
                <div className="p-3 bg-card rounded">
                  <p className="text-xs text-muted-foreground mb-1">
                    Investments
                  </p>
                  <p className="font-bold text-lg text-blue-600">৳ 0</p>
                </div>
                <div className="p-3 bg-card rounded">
                  <p className="text-xs text-muted-foreground mb-1">
                    Profit Earned
                  </p>
                  <p className="font-bold text-lg text-green-600">৳ 1,250</p>
                </div>
                <div className="p-3 bg-card rounded">
                  <p className="text-xs text-muted-foreground mb-1">
                    Closing Balance
                  </p>
                  <p className="font-bold text-lg">৳ 11,250</p>
                </div>
              </div>

              {/* Mini Transaction Table */}
              <div className="py-4 border-t">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">
                  TRANSACTIONS
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>Profit Distribution</span>
                    <span className="text-green-600 font-semibold">
                      ৳ 1,250
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>Investment Maintained</span>
                    <span className="text-muted-foreground">৳ 10,000</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t text-center text-xs text-muted-foreground">
                <p>
                  This is an official statement from Barguna Investment Platform
                </p>
                <p>For inquiries, contact support@barguna.com</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="mr-2" size={16} /> Download PDF
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Print Statement
              </Button>
            </div>
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
