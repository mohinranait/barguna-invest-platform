"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StatCard from "@/components/ui/stat-card";
import StatusBadge from "@/components/ui/status-badge";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Plus, TrendingUp, TrendingUpDown } from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { useUser } from "@/providers/UserProvider";
import {
  IDeposit,
  IDepositRequest,
  TDepositMethod,
} from "@/types/deposit.type";

// Modal imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import KycApprovelAlert from "@/components/shared/KycApprovelAlert";

export default function DepositsPage() {
  const { user } = useUser();
  const [openModal, setOpenModal] = useState(false);

  const [deposits, setDeposits] = useState<IDeposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<IDepositRequest>({
    createdBy: user?._id as string,
    amount: 0,
    paymentMethod: "bkash",
    transactionId: "",
    status: "pending",
    depositNumber: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/member/deposit", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error("Fetch deposits error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.amount ||
      !formData.transactionId ||
      !formData.depositNumber
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/member/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, createdBy: user?._id as string }),
      });

      if (res.ok) {
        toast.success("Request successfull", {
          description:
            "Deposit request submitted successfully! Waiting for manager verification.",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });

        setFormData({
          createdBy: user?._id as string,
          amount: 0,
          paymentMethod: "bkash",
          transactionId: "",
          depositNumber: "",
          status: "pending",
        });

        fetchDeposits();
        setOpenModal(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create deposit");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalDeposited = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingAmount = deposits
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <UserContainer className="space-y-5 pt-4 pb-6">
      <UserHeader />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<TrendingUp className="text-primary" size={24} />}
          label="Total Deposited"
          value={`৳${totalDeposited.toLocaleString()}`}
        />
        <StatCard
          icon={<TrendingUpDown className="text-primary" size={24} />}
          label="Pending Requests"
          value={`৳${pendingAmount.toLocaleString()}`}
          highlight
        />
        <StatCard
          icon={<TrendingUpDown className="text-primary" size={24} />}
          label="Total Requests"
          value={deposits.length.toString()}
        />
      </div>

      {/* Kyc verification alert */}
      <KycApprovelAlert />

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deposit </h1>
          <p className="text-muted-foreground ">
            Manage your deposit requests and track status
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="px-6" disabled={user?.kycStatus !== "approved"}>
              <Plus /> New Deposit
            </Button>
          </DialogTrigger>

          {/* -------- Deposit Modal -------- */}
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Deposit</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: Number(e.target.value),
                    })
                  }
                  min="1000"
                  step="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      paymentMethod: value as TDepositMethod,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="HandCash">Hand Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="880XXXXXXXXX"
                  value={formData.depositNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      depositNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="txnId">Transaction ID / Reference</Label>
                <Input
                  id="txnId"
                  placeholder="Enter transaction ID"
                  value={formData.transactionId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transactionId: e.target.value,
                    })
                  }
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Processing..." : "Submit Deposit Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : deposits.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No deposits yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {deposits.map((deposit) => (
            <Card className="p-0" key={deposit._id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">
                      ৳{deposit.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {deposit.paymentMethod.toUpperCase()} •{" "}
                      {deposit.transactionId}
                    </p>

                    {deposit.status === "rejected" && (
                      <p className="text-sm text-red-600 mt-2">
                        Reason: {deposit.note}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <StatusBadge status={deposit.status}>
                      {deposit.status}
                    </StatusBadge>

                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(deposit.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </UserContainer>
  );
}
