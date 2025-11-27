"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, CheckCircle, Clock, AlertCircle, Download } from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

const withdrawalRequests = [
  {
    id: 1,
    amount: "5,000",
    date: "Nov 28, 2024",
    status: "Pending",
    requestDate: "Nov 28",
  },
  {
    id: 2,
    amount: "3,000",
    date: "Nov 15, 2024",
    status: "Approved",
    requestDate: "Nov 14",
  },
  {
    id: 3,
    amount: "2,500",
    date: "Nov 1, 2024",
    status: "Completed",
    requestDate: "Oct 31",
  },
];

export default function WithdrawalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setAmount("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-green-600" size={20} />;
      case "Pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "Approved":
        return <CheckCircle className="text-blue-600" size={20} />;
      default:
        return <AlertCircle className="text-red-600" size={20} />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <React.Fragment>
      <UserContainer className="pt-4 pb-8">
        <UserHeader />
        <div className=" pt-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
              <p className="text-muted-foreground ">
                Manage your withdrawal requests and track status
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 gap-2"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={20} /> Request Withdrawal
            </Button>
          </div>

          {/* Balance Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Available Balance
              </div>
              <div className="text-3xl font-bold">৳ 11,250</div>
              <div className="text-xs text-muted-foreground mt-2">
                Can withdraw up to this amount
              </div>
            </Card>
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Pending Withdrawals
              </div>
              <div className="text-3xl font-bold">৳ 5,000</div>
              <div className="text-xs text-yellow-600 mt-2">
                Awaiting approval
              </div>
            </Card>
            <Card className="p-6 gap-0">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Completed This Month
              </div>
              <div className="text-3xl font-bold">৳ 2,500</div>
              <div className="text-xs text-green-600 mt-2">
                Successfully withdrawn
              </div>
            </Card>
          </div>

          {/* Withdrawal Form */}
          {showForm && (
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-semibold ">New Withdrawal Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (BDT)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum: ৳ 11,250
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Withdrawal Method
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11">
                    <option>Bank Account</option>
                    <option>Mobile Banking (bKash)</option>
                    <option>Mobile Banking (Nagad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bank Details / Account Number
                  </label>
                  <Input
                    placeholder="Enter your bank account or mobile number"
                    className="h-11"
                  />
                </div>

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

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Withdrawal History */}
          <Card className="p-6">
            <div className="flex items-center justify-between ">
              <h2 className="text-lg font-semibold">Withdrawal History</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Download size={16} /> Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-muted-foreground">
                      Amount
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
                  {withdrawalRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b hover:bg-muted/50 transition"
                    >
                      <td className="py-4 font-semibold">৳ {req.amount}</td>
                      <td className="py-4 text-muted-foreground">
                        {req.requestDate}
                      </td>
                      <td className="py-4 text-muted-foreground">{req.date}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(req.status)}
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(
                              req.status
                            )}`}
                          >
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
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
