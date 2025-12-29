import { Card } from "@/components/ui/card";

import DistributionComponent from "@/components/pages/admin/distribution/DistributionComponent";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { CompanyWallet } from "@/models/CompanyWallet.model";
import { IUser } from "@/types/user.type";
import { IWallet } from "@/types/wallet.type";
import { Distribution } from "@/models/distribution.model";
import { format } from "date-fns";

export default async function ProfitDistributionPage() {
  await connectDB();
  const getAllUsers = await User.find({}).select("fullName status balance");
  const users: IUser[] = JSON.parse(JSON.stringify(getAllUsers));
  const activeUsers = users?.filter((user) => user.status === "active");

  const getDistribution = await Distribution.find({}).limit(5).lean();
  const distributions = JSON.parse(JSON.stringify(getDistribution));

  // Wallet info can be fetched here if needed
  const getWallet = await CompanyWallet.findOne({});
  const wallet: IWallet = JSON.parse(JSON.stringify(getWallet));

  const availableBalance = Math.max(
    0,
    wallet?.availableBalance - wallet?.totalBalance
  );

  console.log({ distributions });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profit Distribution</h1>
        <p className="text-muted-foreground mt-1">
          Distribute profits proportionally to members based on their investment
        </p>
      </div>

      {/* Pool Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-4 gap-0">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Available balance for share
          </div>
          <div className="text-3xl font-bold">৳ {availableBalance || 0}</div>
        </Card>
        <Card className="p-4 gap-0">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Main Balance
          </div>
          <div className="text-3xl font-bold">৳ {wallet?.totalBalance}</div>
        </Card>
        <Card className="p-4 gap-0">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Total Members
          </div>
          <div className="text-3xl font-bold">{users?.length || 0}</div>
        </Card>
        <Card className="p-4 gap-0">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Active Members
          </div>
          <div className="text-3xl font-bold">{activeUsers?.length || 0}</div>
        </Card>
      </div>

      {/* Distribution component */}
      <DistributionComponent users={users} wallet={wallet} />

      {/* Distribution History */}
      <Card className="p-6 gap-0">
        <h2 className="text-lg font-semibold ">Recent Distributions</h2>
        <div className="space-y-3">
          {distributions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No distributions found.
            </p>
          )}
          {distributions.map(
            (
              dist: {
                members: number;
                amount: number;
                createdAt: string;
                status: string;
              },
              i: number
            ) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(dist.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Distributed to {dist.members} members
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    ৳ {dist.amount}
                  </p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded inline-block mt-1">
                    {dist.status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
