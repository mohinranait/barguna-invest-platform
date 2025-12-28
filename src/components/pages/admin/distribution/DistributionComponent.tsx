"use client";
import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Calculator, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IUser } from "@/types/user.type";
import { IWallet } from "@/types/wallet.type";

type Props = {
  users: IUser[];
  wallet: IWallet;
};
const DistributionComponent = ({ users, wallet }: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const availableBalance = Math.max(
    0,
    wallet?.availableBalance - wallet?.totalBalance
  );

  const [totalProfit, setTotalProfit] = useState(
    availableBalance?.toString() || ""
  );

  const totalInvested = users.reduce((sum, m) => sum + m.balance, 0);

  const distribution = users.map((member) => ({
    ...member,
    share:
      totalInvested > 0
        ? (member.balance / totalInvested) *
          Number.parseFloat(totalProfit || "0")
        : 0,
    ratio: totalInvested > 0 ? (member.balance / totalInvested) * 100 : 0,
  }));

  const handleDistribute = () => {
    setShowPreview(true);
  };

  const handleConfirm = async () => {
    setConfirmed(true);
    try {
      const res = await fetch("/api/admin/distribution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: Number.parseFloat(totalProfit || "0"),
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to distribute profit");
      }
    } catch (error) {
      console.log({ error });
    }

    setConfirmed(false);
    setShowPreview(false);
    setTotalProfit("");
  };
  return (
    <Fragment>
      {/* Profit Input */}
      <Card className="p-6 border-2 border-primary/20 gap-0 bg-primary/5">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calculator className="text-primary" size={24} />
          Enter Business Profit
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Profit Amount (BDT)
            </label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="0"
                value={totalProfit}
                onChange={(e) => setTotalProfit(e.target.value)}
                className="flex-1 h-12 text-lg"
                min={0}
              />
              <Button
                onClick={handleDistribute}
                className="bg-primary hover:bg-primary/90 px-8"
                disabled={
                  !totalProfit ||
                  Number.parseFloat(totalProfit) >
                    wallet?.availableBalance - wallet?.totalBalance
                }
              >
                Calculate Distribution
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-medium text-green-700 mb-1">
                EXPECTED RETURN
              </p>
              <p className="text-2xl font-bold text-green-700">
                {totalInvested > 0
                  ? (
                      (Number.parseFloat(totalProfit || "0") / totalInvested) *
                      100
                    ).toFixed(2)
                  : "0"}
                %
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-700 mb-1">
                PROFIT PER 100K
              </p>
              <p className="text-2xl font-bold text-blue-700">
                ৳{" "}
                {totalInvested > 0
                  ? Math.floor(
                      (Number.parseFloat(totalProfit || "0") / totalInvested) *
                        100000
                    )
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Distribution Preview */}
      {showPreview && (
        <Card className="p-6 gap-0 border-2 border-secondary/20 bg-secondary/5">
          <div className="flex items-center justify-between ">
            <h2 className="text-xl font-semibold">Distribution Preview</h2>
            <Button
              variant="ghost"
              onClick={() => setShowPreview(false)}
              disabled={confirmed}
            >
              ✕
            </Button>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-2 font-medium">Member</th>
                  <th className="text-right py-3 px-2 font-medium">
                    Investment
                  </th>
                  <th className="text-right py-3 px-2 font-medium">Share %</th>
                  <th className="text-right py-3 px-2 font-medium">
                    Profit Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {distribution.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b hover:bg-muted/30 transition"
                  >
                    <td className="py-3 px-2 font-medium">{member.fullName}</td>
                    <td className="text-right py-3 px-2">
                      ৳ {member.balance.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-2">
                      {member.ratio.toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-2 font-semibold text-primary">
                      ৳ {Math.floor(member.share).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary/10 font-semibold">
                  <td className="py-3 px-2">TOTAL</td>
                  <td className="text-right py-3 px-2">
                    ৳ {totalInvested.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-2">100%</td>
                  <td className="text-right py-3 px-2">
                    ৳{" "}
                    {Math.floor(
                      distribution.reduce((sum, m) => sum + m.share, 0)
                    ).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-700 flex gap-3">
            <AlertCircle size={20} className=" mt-0.5" />
            <div>
              <p className="font-medium mb-1">Rounding Note:</p>
              <p>
                Profits are rounded to nearest whole number. Any remaining
                balance will be added to the largest shareholder is
                distribution.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setShowPreview(false)}
              disabled={confirmed}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleConfirm}
              disabled={confirmed}
            >
              {confirmed ? (
                <>
                  <LoaderCircle className="mr-2 animate-spin" />
                  Distribution Confirmed
                </>
              ) : (
                "Confirm & Distribute"
              )}
            </Button>
          </div>
        </Card>
      )}
    </Fragment>
  );
};

export default DistributionComponent;
