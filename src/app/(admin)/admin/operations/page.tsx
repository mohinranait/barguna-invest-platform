"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/providers/UserProvider";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  ICompanyOperation,
  IOperationRequest,
} from "@/types/company-operation.type";

export default function OperationsPage() {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profits, setProfits] = useState<ICompanyOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal control
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<IOperationRequest>({
    createdBy: user?._id as string,
    amount: 0,
    type: "profit",
    note: "",
    distributed: true,
  });

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/company-operation", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProfits(data.profits);
      }
    } catch (err) {
      console.error("Fetch profits error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.amount || !formData.type) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/company-operation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, createdBy: user?._id }),
      });

      if (res.ok) {
        setMessage("Request submitted successfully!");
        setFormData({
          createdBy: user?._id as string,
          amount: 0,
          type: "profit",
          note: "",
          distributed: false,
        });
        fetchProfits();
        setOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create profit");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle distributed from table action button
  const handleDistributed = async (op: ICompanyOperation) => {
    try {
      setSubmitting(true);
      await fetch(`/api/admin/company-operation/${op?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ distributed: true }),
      });
    } catch (err) {
      setError("An error occurred");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
      fetchProfits();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Operations</h1>
          <p className="text-muted-foreground mt-1">
            Track business income and expenses
          </p>
        </div>

        {/* Add Button */}
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setOpen(true)}
        >
          <Plus size={18} className="mr-2" /> Add Operation
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 gap-0 bg-green-50 border-green-200">
          <div className="text-sm font-medium text-green-700 mb-2">
            Total Income
          </div>
          <div className="text-3xl font-bold text-green-700">৳ 150,000</div>
          <div className="text-xs text-green-600 mt-2">This month</div>
        </Card>
        <Card className="p-6 gap-0 bg-red-50 border-red-200">
          <div className="text-sm font-medium text-red-700 mb-2">
            Total Expenses
          </div>
          <div className="text-3xl font-bold text-red-700">৳ 50,000</div>
          <div className="text-xs text-red-600 mt-2">This month</div>
        </Card>
        <Card className="p-6 gap-0 bg-blue-50 border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-2">
            Net Profit
          </div>
          <div className="text-3xl font-bold text-blue-700">৳ 100,000</div>
          <div className="text-xs text-blue-600 mt-2">
            Available to distribute
          </div>
        </Card>
      </div>

      {/* Modal Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Business Operation</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Error / Success */}
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

            {/* Type Select */}
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select
                defaultValue="increase"
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as "profit" | "loss" | "running",
                  })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Current Invest </SelectItem>
                  <SelectItem value="profit">Business Profit</SelectItem>
                  <SelectItem value="loss">Business Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount (BDT)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                placeholder="0"
                className="h-11"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Input
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="Enter description"
                className="h-11"
              />
            </div>

            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 ">
              <Checkbox
                id="toggle-2"
                defaultChecked={formData?.distributed}
                onCheckedChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    distributed: e as boolean,
                  }));
                }}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  Enable notifications
                </p>
                <p className="text-muted-foreground text-sm">
                  You can enable or disable notifications at any time.
                </p>
              </div>
            </Label>

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting && <LoaderCircle className="animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Operations Log */}
      <Card className="p-6 gap-0">
        <h2 className="text-lg font-semibold mb-4">Recent Operations</h2>
        {loading ? (
          "Loading..."
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 font-medium text-muted-foreground">
                    Note
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    Distribut
                  </th>
                </tr>
              </thead>
              <tbody>
                {profits.map((op) => (
                  <tr
                    key={op._id}
                    className="border-b hover:bg-muted/50 transition"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {op.type === "profit" ? (
                          <Plus className="text-green-600" size={16} />
                        ) : (
                          <Minus className="text-red-600" size={16} />
                        )}
                        {op.type === "profit"
                          ? "Business Income"
                          : "Business Expense"}
                      </div>
                    </td>
                    <td className="py-3">{op.note}</td>
                    <td
                      className={`py-3 text-right font-semibold ${
                        op.type === "profit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {op.type === "profit" ? "+" : "-"}৳ {op.amount}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {format(new Date(op.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      <Button
                        size={"sm"}
                        className="text-xs"
                        disabled={op.distributed}
                        onClick={() => handleDistributed(op)}
                        type="button"
                      >
                        Distribut
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
  );
}
