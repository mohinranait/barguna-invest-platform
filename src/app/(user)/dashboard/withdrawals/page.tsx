"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  LoaderCircle,
} from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUser } from "@/providers/UserProvider";
import {
  IWithdraw,
  IWithdrawMethod,
  IWithdrawRequest,
} from "@/types/withdraw.type";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function WithdrawalsPage() {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<IWithdraw[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState<IWithdrawRequest>({
    createdBy: user?._id as string,
    amount: 0,
    method: "bkash",
    status: "pending",
    accountNumber: "",
    adminNote: "",
  });

  // Form submit method
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Login first");
      return;
    }

    if (user?.balance < formData?.amount) {
      setError("Insufficient balance");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/member/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, createdBy: user?._id as string }),
      });

      if (res.ok) {
        setMessage(
          "Withdraw request submitted successfully! Waiting for manager verification."
        );
        setFormData({
          createdBy: user?._id as string,
          amount: 0,
          method: "bkash",
          accountNumber: "",
          status: "pending",
          adminNote: "",
        });
        setShowForm(false);
        fetchWithdrawals();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create withdraw");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/member/withdraw", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error("Fetch withdrawals error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Icon status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-600" size={16} />;
      case "pending":
        return <Clock className="text-yellow-600" size={16} />;
      case "rejected":
        return <AlertCircle className="text-red-600" size={16} />;
      default:
        return <CheckCircle className="text-blue-600" size={16} />;
    }
  };

  // Status badge color
  const getStatusBg = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // pending withdrawal balance
  const pendingAmount = withdrawals
    ?.filter((item) => item.status === "pending")
    .reduce((acc, item) => (acc += item.amount), 0);

  // complete withdraw
  const approvedAmount = withdrawals
    ?.filter((item) => item.status === "approved")
    .reduce((acc, item) => (acc += item.amount), 0);

  return (
    <React.Fragment>
      <UserContainer className="pt-4 pb-8">
        <UserHeader />
        <div className="pt-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
              <p className="text-muted-foreground ">
                Manage your withdrawal requests and track status
              </p>
            </div>

            {/* Withdrawal Modal Trigger */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus size={20} /> Request Withdrawal
                </Button>
              </DialogTrigger>

              {/* Modal Form */}
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>New Withdrawal Request</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount (BDT)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: Number(e.target.value),
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum: ৳ {user?.balance}
                    </p>
                  </div>

                  {/* Method + Number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Withdrawal Method
                      </label>

                      <Select
                        value={formData.method}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            method: value as IWithdrawMethod,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                          <SelectItem value="HandCash">Hand Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.method !== "HandCash" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Receive number
                        </label>
                        <Input
                          placeholder={`Enter your ${formData.method} number`}
                          value={formData.accountNumber}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              accountNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Info box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                    <p className="font-medium mb-2">Processing Information:</p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        • Withdrawal requests are processed within 2-3 business
                        days
                      </li>
                      <li>• Admin review and verification required</li>
                      <li>• Bank transfer fees may apply</li>
                    </ul>
                  </div>

                  {/* Buttons */}
                  <DialogFooter className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary"
                    >
                      {submitting && (
                        <LoaderCircle className="animate-spin mr-1" />
                      )}
                      Submit Request
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Balance Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Available Balance
              </div>
              <div className="text-3xl font-bold">
                ৳ {user?.balance?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Can withdraw up to this amount
              </div>
            </Card>

            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Pending Withdrawals
              </div>
              <div className="text-3xl font-bold">
                ৳ {pendingAmount?.toLocaleString()}
              </div>
              <div className="text-xs text-yellow-600 mt-2">
                Awaiting approval
              </div>
            </Card>

            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Completed Withdrawals
              </div>
              <div className="text-3xl font-bold">
                ৳ {approvedAmount?.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 mt-2">
                Successfully withdrawn
              </div>
            </Card>
          </div>

          {/* Withdrawal History */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Withdrawal History</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} /> Export
              </Button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : withdrawals?.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500">No deposits yet</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-left py-3 font-medium text-muted-foreground">
                        Account
                      </th>
                      <th className="text-left py-3 font-medium text-muted-foreground">
                        Request Date
                      </th>
                      <th className="text-left py-3 font-medium text-muted-foreground">
                        Processed Date
                      </th>

                      <th className="text-left py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 font-medium text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((req) => (
                      <tr
                        key={req._id}
                        className="border-b hover:bg-muted/50 transition"
                      >
                        <td className="py-4 font-semibold">
                          ৳ {req.amount?.toLocaleString()}
                        </td>

                        <td className="py-4 text-muted-foreground">
                          <p>{req.accountNumber}</p>
                          <p className="uppercase text-xs">{req.method}</p>
                        </td>

                        <td className="py-4 text-muted-foreground">
                          {format(new Date(req.createdAt), "MMM dd, yyyy")}
                        </td>

                        <td className="py-4 text-muted-foreground">
                          {format(new Date(req.updatedAt), "MMM dd, yyyy")}
                        </td>

                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex gap-1 items-center uppercase px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(
                                req.status
                              )}`}
                            >
                              {getStatusIcon(req.status)}
                              {req.status}
                            </span>
                          </div>
                        </td>

                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
