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
import { ITransaction } from "@/types/transaction.type";

export default function DepositVerificationPage() {
  const { user } = useUser();
  const [deposits, setDeposits] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<ITransaction | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "manager" || user?.role === "admin") {
      fetchPendingDeposits();
    }
  }, [user]);

  const fetchPendingDeposits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/transactions", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.transactions);
      }
    } catch (err) {
      console.error(" Fetch pending deposits error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (
    depositId: string,
    status: "verified" | "rejected"
  ) => {
    if (status === "rejected" && !rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const res = await fetch(`/api/admin/transactions/${depositId}`, {
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

      if (res.ok) {
        setMessage(`Deposit ${status} successfully!`);
        setSelectedDeposit(null);
        setRejectionReason("");
        fetchPendingDeposits();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to process deposit");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Verify error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = deposits.filter((d) => d.status === "pending").length;
  const totalAmount = deposits.reduce((sum, d) => sum + d.amount, 0);

  if (user?.role !== "manager") {
    return (
      <div className="text-center py-8 text-gray-500">
        Access denied. Only managers can verify deposits.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deposit Requests</h1>
          <p className="text-muted-foreground mt-1">
            View and manage community deposit requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          icon={<CheckCircle className="text-primary" size={24} />}
          label="Pending Deposits"
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

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="all">All Deposits</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <LoadingSpinner />
          ) : deposits.filter((d) => d.status === "pending").length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No pending deposits</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {deposits
                .filter((d) => d.status === "pending")
                .map((deposit) => (
                  <Card
                    key={deposit._id}
                    className={
                      selectedDeposit?._id === deposit._id
                        ? "border-blue-500"
                        : ""
                    }
                  >
                    <CardContent className="">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">
                              ৳{deposit.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {deposit.paymentMethod.toUpperCase()}
                            </p>
                          </div>
                          <StatusBadge status={deposit.status}>
                            {deposit.status}
                          </StatusBadge>
                        </div>

                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="font-medium">Member:</span>{" "}
                            {deposit.createdBy.fullName}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {deposit.createdBy.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>{" "}
                            {deposit.createdBy.phone}
                          </div>
                          <div>
                            <span className="font-medium">Transaction ID:</span>{" "}
                            {deposit.transactionId}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(deposit.createdAt).toLocaleString()}
                          </div>
                        </div>

                        {selectedDeposit?._id === deposit._id && (
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
                                  handleVerify(deposit._id, "verified")
                                }
                                disabled={processing}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                {processing ? "Processing..." : "Approve"}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleVerify(deposit._id, "rejected")
                                }
                                disabled={processing}
                                variant="destructive"
                                className="flex-1"
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedDeposit(null);
                                  setRejectionReason("");
                                }}
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedDeposit?._id !== deposit._id && (
                          <Button
                            onClick={() => setSelectedDeposit(deposit)}
                            variant="outline"
                            className="w-full"
                          >
                            Review
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
              {deposits.map((deposit) => (
                <Card key={deposit._id}>
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          ৳{deposit.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {deposit.createdBy.fullName}
                        </p>
                      </div>
                      <StatusBadge status={deposit.status}>
                        {deposit.status}
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
