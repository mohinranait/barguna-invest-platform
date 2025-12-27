"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  IUser,
  IUserRequest,
  TUserKycStatus,
  TUserRole,
  TUserStatus,
} from "@/types/user.type";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import React, { useState } from "react";

const UpdateMemberPage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<IUserRequest>({
    fullName: "",
    email: "",
    phone: "",
    role: "member",
    status: "pending",
    kycStatus: "pending",
    investedAmount: 0,
    withdrawAmount: 0,
    profitEarned: 0,
    balance: 0,
    address: "",
    dateOfBirth: "",
  });

  const handleInputChange = (field: keyof IUser, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "User information updated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: "Failed to update user information",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Update User Information
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage and update user details from the admin panel
          </p>
        </div>

        {/* Messages */}
        {message && (
          <Alert
            className={`mb-6 ${
              message.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Form Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update basic user information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName || ""}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter address"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Information */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage user account credentials and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 ">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      readOnly
                      value={formData.email || ""}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role || "member"}
                      onValueChange={(value) =>
                        handleInputChange("role", value as TUserRole)
                      }
                    >
                      <SelectTrigger id="role" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status || "pending"}
                      onValueChange={(value) =>
                        handleInputChange("status", value as TUserStatus)
                      }
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kycStatus">KYC Status</Label>
                    <Select
                      value={formData.kycStatus || "pending"}
                      onValueChange={(value) =>
                        handleInputChange("kycStatus", value as TUserKycStatus)
                      }
                    >
                      <SelectTrigger id="kycStatus" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Information */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Update user financial data and balances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="balance">Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={formData.balance || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "balance",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investedAmount">Invested Amount</Label>
                    <Input
                      id="investedAmount"
                      type="number"
                      value={formData.investedAmount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "investedAmount",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Withdrawn Amount</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      value={formData.withdrawAmount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "withdrawAmount",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profitEarned">Profit Earned</Label>
                    <Input
                      id="profitEarned"
                      type="number"
                      value={formData.profitEarned || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "profitEarned",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update phone and payment method details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Updating..." : "Update User"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default UpdateMemberPage;
