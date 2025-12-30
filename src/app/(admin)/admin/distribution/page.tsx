import { Card } from "@/components/ui/card";

import DistributionComponent from "@/components/pages/admin/distribution/DistributionComponent";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { CompanyWallet } from "@/models/CompanyWallet.model";
import { IUser } from "@/types/user.type";
import { IWallet } from "@/types/wallet.type";
import StatementLine from "@/components/shared/StatementLine";

export default async function ProfitDistributionPage() {
  await connectDB();
  const getAllUsers = await User.find({}).select("fullName status balance");
  const users: IUser[] = JSON.parse(JSON.stringify(getAllUsers));
  const activeUsers = users?.filter((user) => user.status === "active");

  // Wallet info can be fetched here if needed
  const getWallet = await CompanyWallet.findOne({});
  const wallet: IWallet = JSON.parse(JSON.stringify(getWallet));

  const availableBalance = Math.max(
    0,
    wallet?.availableBalance - wallet?.totalBalance
  );

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
      <Card className="p-6 ">
        <h2 className="text-lg font-semibold ">Recent Distributions</h2>
        <StatementLine />
      </Card>
    </div>
  );
}
