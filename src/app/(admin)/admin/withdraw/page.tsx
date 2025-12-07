"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, DollarSign } from "lucide-react";
import { useUser } from "@/providers/UserProvider";
import { IWithdraw } from "@/types/withdraw.type";
import { format } from "date-fns";

export default function WithdrawVerificationPage() {
  const { user } = useUser();
  const [withdraws, setWithdraws] = useState<IWithdraw[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState<IWithdraw | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "manager" || user?.role === "admin") {
      fetchWithdraws();
    }
  }, [user]);

  const fetchWithdraws = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/withdraw", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setWithdraws(data.withdrawals);
      }
    } catch (err) {
      console.error(" Fetch pending withdrawals error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (
    withdrawId: string,
    status: "approved" | "rejected"
  ) => {
    if (status === "rejected" && !rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const res = await fetch(`/api/admin/withdraw/${withdrawId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status,
          note: status === "rejected" ? rejectionReason : "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`withdraw ${status} successfully!`);
        setSelectedWithdraw(null);
        setRejectionReason("");
        fetchWithdraws();

        if (status === "approved") {
          // Create new transaction
          await fetch(`/api/admin/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              createdBy: user?._id,
              amount: selectedWithdraw?.amount,
              type: "withdraw",
              referenceId: data?.withdraw?._id,
            }),
          });
        }
      } else {
        setError(data.error || "Failed to process withdraw");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Verify error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = withdraws.filter((d) => d.status === "pending").length;
  const totalAmount = withdraws.reduce((sum, d) => sum + d.amount, 0);

  if (user?.role !== "manager" && user?.role !== "admin") {
    return (
      <div className="text-center py-8 text-gray-500">
        Access denied. Only managers can verify withdraw.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Withdraw Requests</h1>
          <p className="text-muted-foreground mt-1">
            View and manage community withdraw requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          icon={<CheckCircle className="text-primary" size={24} />}
          label="Pending Withdraw"
          value={pendingCount.toString()}
        />
        <StatCard
          icon={<DollarSign className="text-primary" size={24} />}
          label="Total Amount"
          value={`৳${totalAmount.toLocaleString()}`}
        />
      </div>

      {message && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabs for admin withdraw verification */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="all">All Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <LoadingSpinner />
          ) : withdraws.filter((d) => d.status === "pending").length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No pending withdraws</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {withdraws
                .filter((d) => d.status === "pending")
                .map((withdraw) => (
                  <Card
                    key={withdraw._id}
                    className={
                      selectedWithdraw?._id === withdraw._id
                        ? "border-blue-500"
                        : ""
                    }
                  >
                    <CardContent className="">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">
                              ৳{withdraw.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {withdraw.method.toUpperCase()}
                            </p>
                          </div>
                          <StatusBadge status={withdraw.status}>
                            {withdraw.status}
                          </StatusBadge>
                        </div>

                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="font-medium">Member:</span>{" "}
                            {withdraw.createdBy?.fullName}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {withdraw.createdBy.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>{" "}
                            {withdraw.createdBy.phone}
                          </div>

                          <div>
                            <span className="font-medium">
                              Withdraw Number:
                            </span>{" "}
                            {withdraw.accountNumber}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {format(
                              new Date(withdraw.updatedAt),
                              "MMM dd, yyyy - hh:mm a"
                            )}
                          </div>
                        </div>

                        {selectedWithdraw?._id === withdraw._id && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            <div>
                              <Label htmlFor="reason" className="mb-2">
                                Rejection Reason (if rejecting)
                              </Label>
                              <Textarea
                                id="reason"
                                placeholder="Enter reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) =>
                                  setRejectionReason(e.target.value)
                                }
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleVerify(withdraw._id, "approved")
                                }
                                disabled={processing}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                {processing ? "Processing..." : "Approve"}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleVerify(withdraw._id, "rejected")
                                }
                                disabled={processing}
                                variant="destructive"
                                className="flex-1"
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedWithdraw(null);
                                  setRejectionReason("");
                                }}
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedWithdraw?._id !== withdraw._id && (
                          <Button
                            onClick={() => setSelectedWithdraw(withdraw)}
                            variant="outline"
                            className="w-full"
                          >
                            Review withdraw request
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {withdraws.map((withdraw) => (
                <Card key={withdraw._id}>
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          ৳{withdraw.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {withdraw.createdBy.fullName}
                        </p>
                      </div>
                      <StatusBadge status={withdraw.status}>
                        {withdraw.status}
                      </StatusBadge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
