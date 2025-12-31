import { Card } from "@/components/ui/card";
import { Users, TrendingUp, BarChart3, PieChartIcon } from "lucide-react";
import ProfitExpense from "@/components/pages/admin/dashboard/ProfitExpense";
import MemberDistributionCard from "./MemberDistributionCard";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import { Distribution } from "@/models/distribution.model";
import { IDistribution } from "@/types/distribution.type";
import { CompanyWallet } from "@/models/CompanyWallet.model";
import { IWallet } from "@/types/wallet.type";

export default async function AdminDashboard() {
  await connectDB();
  const getUsers = await User.find({}).countDocuments();
  const totalUsers = JSON.parse(JSON.stringify(getUsers));

  const getDistribution = await Distribution.find({}).lean();
  const distributionData: IDistribution[] = JSON.parse(
    JSON.stringify(getDistribution)
  );
  const totalDistributedProfit = distributionData.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  // wallet data
  const getWallet = await CompanyWallet.findOne({}).lean();
  const wallet: IWallet = JSON.parse(JSON.stringify(getWallet));
  const statsData = [
    {
      id: 2,
      title: "Balance in Wallet",
      value: `৳ ${wallet?.totalBalance.toLocaleString()}`,
      subtitle: "From all members",
      subtitleColor: "text-muted-foreground",
      icon: TrendingUp,
      iconColor: "text-secondary",
    },

    {
      id: 4,
      title: "Available balance",
      value: `৳ ${(
        wallet?.availableBalance - wallet.totalBalance
      )?.toLocaleString()}`,
      subtitle: "Available for distribution",
      subtitleColor: "text-muted-foreground",
      icon: PieChartIcon,
      iconColor: "text-secondary",
    },
    {
      id: 3,
      title: "Profit Distributed",
      value: `৳ ${totalDistributedProfit.toLocaleString()}`,
      subtitle: "12.5% average return",
      subtitleColor: "text-green-600",
      icon: BarChart3,
      iconColor: "text-primary",
    },
    {
      id: 1,
      title: "Total Members",
      value: totalUsers.toString(),
      subtitle: "+12 new this month",
      subtitleColor: "text-green-600",
      icon: Users,
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor platform activity and financial metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="p-5 shadow-none gap-0">
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
        {/* Profit vs Expense */}
        <ProfitExpense />

        {/* Member Distribution */}
        <MemberDistributionCard />
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted/70 rounded-lg"
            >
              <div>
                <p className="font-medium">Member {i} - Deposit</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">৳ {50000 * i}</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
