import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import React from "react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { connectDB } from "@/lib/db";
import { Distribution } from "@/models/distribution.model";
import { IDistribution } from "@/types/distribution.type";
import { format } from "date-fns";

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

export default async function StatementsPage() {
  await connectDB();

  const getStatements = await Distribution.find({})
    .limit(10)
    .sort({ createdAt: -1 })
    .lean();
  const distributions: IDistribution[] = JSON.parse(
    JSON.stringify(getStatements)
  );

  // total amount distributed
  const totalDistributed = distributions.reduce(
    (sum, dist) => sum + dist.amount,
    0
  );
  return (
    <React.Fragment>
      <UserContainer className="pt-4 pb-8">
        <UserHeader />
        <div className=" space-y-5 pt-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Statements</h1>
            <p className="text-muted-foreground ">
              Preview your monthly investment statements
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Statements
              </div>
              <div className="text-3xl font-bold">{distributions.length}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Available for download
              </div>
            </Card>
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Distributed Amount
              </div>
              <div className="text-3xl font-bold">৳ {totalDistributed}</div>
              <div className="text-xs text-green-600 mt-2">
                From included members
              </div>
            </Card>
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Last Statement
              </div>
              <div className="text-3xl font-bold">
                ৳ {distributions[0].amount}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Date:{" "}
                {format(new Date(distributions[0].createdAt), "MMM dd, yyyy")}
              </div>
            </Card>
          </div>

          {/* Statements List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold ">Available Statements</h2>
            <div className="space-y-3">
              {distributions.map((stmt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition border"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {format(new Date(stmt?.createdAt), "MMMM yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="inline mr-1" size={14} />
                        {format(new Date(stmt?.createdAt), "MMM dd, yyyy")} •
                        Distributed to {stmt.members} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ৳ {stmt.amount}
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
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
