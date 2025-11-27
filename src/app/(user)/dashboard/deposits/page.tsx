"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StatCard from "@/components/ui/stat-card";
import StatusBadge from "@/components/ui/status-badge";
import LoadingSpinner from "@/components/ui/loading-spinner";

import { CreditCard } from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

interface Deposit {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  phone: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

export default function DepositsPage() {
  //   const { token, user } = useAuth();
  const token = "sample-token";
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "bkash",
    transactionId: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, [token]);

  const fetchDeposits = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("/api/deposits/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error("[v0] Fetch deposits error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.amount || !formData.transactionId || !formData.phone) {
      setError("Please fill in all fields");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/deposits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
          phone: formData.phone,
        }),
      });

      if (res.ok) {
        // const data = await res.json();
        setMessage(
          "Deposit request submitted successfully! Waiting for manager verification."
        );
        setFormData({
          amount: "",
          paymentMethod: "bkash",
          transactionId: "",
          phone: "",
        });
        fetchDeposits();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create deposit");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("[v0] Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalDeposited = deposits
    .filter((d) => d.status === "verified")
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingAmount = deposits
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <UserContainer className="space-y-5 pt-4 pb-6 ">
      <UserHeader />
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<CreditCard className="text-primary" size={24} />}
          label="Total Deposited"
          value={`৳${totalDeposited.toLocaleString()}`}
        />
        <StatCard
          icon={<CreditCard className="text-primary" size={24} />}
          label="Pending Requests"
          value={`৳${pendingAmount.toLocaleString()}`}
          highlight
        />
        <StatCard
          icon={<CreditCard className="text-primary" size={24} />}
          label="Total Requests"
          value={deposits.length.toString()}
        />
      </div>

      <Tabs defaultValue="new-deposit" className="w-full">
        <TabsList>
          <TabsTrigger value="new-deposit">New Deposit</TabsTrigger>
          <TabsTrigger value="history">Deposit History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Deposit</CardTitle>
              <CardDescription>
                Send money via bKash or Nagad and enter transaction details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {message}
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
                      setFormData({ ...formData, amount: e.target.value })
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
                      setFormData({ ...formData, paymentMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="880XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="txnId">Transaction ID / Reference</Label>
                  <Input
                    id="txnId"
                    placeholder="Enter transaction ID from bKash/Nagad"
                    value={formData.transactionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionId: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Example: XXXXXXXXXXXX (from receipt)
                  </p>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Processing..." : "Submit Deposit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {loading ? (
            <LoadingSpinner />
          ) : deposits.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No deposits yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {deposits.map((deposit) => (
                <Card key={deposit._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold">
                              ৳{deposit.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {deposit.paymentMethod.toUpperCase()} •{" "}
                              {deposit.transactionId}
                            </p>
                          </div>
                        </div>
                        {deposit.rejectionReason && (
                          <p className="text-sm text-red-600 mt-2">
                            Reason: {deposit.rejectionReason}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <StatusBadge status={deposit.status}>
                          {deposit.status}
                        </StatusBadge>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </UserContainer>
  );
}
