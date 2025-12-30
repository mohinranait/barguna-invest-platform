import { Card } from "@/components/ui/card";
import React from "react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { connectDB } from "@/lib/db";
import { Distribution } from "@/models/distribution.model";
import { IDistribution } from "@/types/distribution.type";
import { format } from "date-fns";
import StatementLine from "@/components/shared/StatementLine";

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
            <StatementLine />
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
