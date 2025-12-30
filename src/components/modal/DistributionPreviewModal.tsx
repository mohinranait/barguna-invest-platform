"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDistributionRecord } from "@/types/distribution.record.type";
import { IDistribution } from "@/types/distribution.type";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IDistribution | null;
}

const DistributionPreviewModal = ({ open, onOpenChange, data }: Props) => {
  const [records, setRecords] = useState<IDistributionRecord[]>([]);
  const fetchDistributions = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/distribution/${id}`);
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Failed to fetch distribution records");
      setRecords(result.distributions);
    } catch (error) {
      console.log({ error });
    }
  };

  const totalInvested = records.reduce(
    (acc, record) => acc + record.userInvestment,
    0
  );

  console.log({ records });

  useEffect(() => {
    if (data?._id) {
      fetchDistributions(data._id);
    }
  }, [data?._id]);

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-3xl  ">
        <DialogHeader>
          <DialogTitle>Distribution Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm overflow-y-auto max-h-[70vh]">
          <div className="bg-gray-100 p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <span>Date</span>
              <span>{format(new Date(data.createdAt), "MMM dd, yyyy")}</span>
            </div>

            <div className="flex justify-between">
              <span>Members</span>
              <span>{data.members}</span>
            </div>

            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-semibold text-green-600">
                ৳ {data.amount}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span>{data.status}</span>
            </div>
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
                {records.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b hover:bg-muted/30 transition"
                  >
                    <td className="py-3 px-2 font-medium">
                      {member.ownerBy?.fullName}
                    </td>
                    <td className="text-right py-3 px-2">
                      ৳ {member.userInvestment}
                    </td>
                    <td className="text-right py-3 px-2">
                      {Number(member.ratio).toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-2 font-semibold text-primary">
                      ৳ {Math.floor(member.userProfitAmount).toLocaleString()}
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
                    {data.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DistributionPreviewModal;
