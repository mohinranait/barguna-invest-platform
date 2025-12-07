"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, DollarSign, XCircle } from "lucide-react";
import { useUser } from "@/providers/UserProvider";
import { IWithdraw } from "@/types/withdraw.type";
import { format } from "date-fns";

export default function WithdrawVerificationPage() {
  const { user } = useUser();
  const [withdraws, setWithdraws] = useState<IWithdraw[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWithdrawForReject, setSelectedWithdrawForReject] =
    useState<IWithdraw | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

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
      console.error("Fetch pending withdrawals error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdraw: IWithdraw) => {
    await handleVerify(withdraw._id, "approved", "");
  };

  const openRejectModal = (withdraw: IWithdraw) => {
    setSelectedWithdrawForReject(withdraw);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedWithdrawForReject) return;
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required");
      return;
    }
    await handleVerify(
      selectedWithdrawForReject._id,
      "rejected",
      rejectionReason
    );
    setRejectModalOpen(false);
  };

  const handleVerify = async (
    withdrawId: string,
    status: "approved" | "rejected",
    note: string
  ) => {
    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const res = await fetch(`/api/admin/withdraw/${withdrawId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, note }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Withdraw ${status} successfully!`);
        fetchWithdraws();

        if (status === "approved") {
          await fetch("/api/admin/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              createdBy: user?._id,
              amount: data?.withdraw?.amount,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Withdraw Requests</h1>
          <p className="text-muted-foreground mt-1">
            View and manage community withdraw requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Success/Error Alerts */}
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

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="all">All Withdraws</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : pendingCount === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                No pending withdraw requests
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pending Withdraw Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdraws
                        .filter((d) => d.status === "pending")
                        .map((withdraw) => (
                          <TableRow key={withdraw._id}>
                            <TableCell className="font-semibold">
                              ৳{withdraw.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {withdraw.createdBy?.fullName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {withdraw.createdBy?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="uppercase">
                              {withdraw.method}
                            </TableCell>
                            <TableCell>{withdraw.accountNumber}</TableCell>
                            <TableCell>
                              {format(
                                new Date(withdraw.updatedAt),
                                "MMM dd, yyyy - hh:mm a"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(withdraw)}
                                  disabled={processing}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openRejectModal(withdraw)}
                                  disabled={processing}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Withdraw History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdraws.map((w) => (
                    <TableRow key={w._id}>
                      <TableCell className="font-medium">
                        ৳{w.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{w.createdBy.fullName}</TableCell>
                      <TableCell>
                        <StatusBadge status={w.status}>{w.status}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(w.updatedAt), "MMM dd, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdraw Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this withdraw request. This
              will be visible to the member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount</Label>
              <p className="font-semibold">
                ৳{selectedWithdrawForReject?.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Member</Label>
              <p>{selectedWithdrawForReject?.createdBy?.fullName}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? "Processing..." : "Reject Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
