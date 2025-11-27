"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"

const operations = [
  { id: 1, type: "Business Expense", amount: "15,000", date: "Nov 25, 2024", category: "Operations" },
  { id: 2, type: "Business Income", amount: "75,000", date: "Nov 24, 2024", category: "Sales" },
  { id: 3, type: "Business Expense", amount: "8,500", date: "Nov 20, 2024", category: "Marketing" },
]

export default function OperationsPage() {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Business Operations</h1>
        <p className="text-muted-foreground mt-1">Track business income and expenses</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="text-sm font-medium text-green-700 mb-2">Total Income</div>
          <div className="text-3xl font-bold text-green-700">৳ 150,000</div>
          <div className="text-xs text-green-600 mt-2">This month</div>
        </Card>
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-sm font-medium text-red-700 mb-2">Total Expenses</div>
          <div className="text-3xl font-bold text-red-700">৳ 50,000</div>
          <div className="text-xs text-red-600 mt-2">This month</div>
        </Card>
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-2">Net Profit</div>
          <div className="text-3xl font-bold text-blue-700">৳ 100,000</div>
          <div className="text-xs text-blue-600 mt-2">Available to distribute</div>
        </Card>
      </div>

      {/* Add Operations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Income Form */}
        <Card className="p-6 border-2 border-green-200 bg-green-50/30">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
            <Plus size={20} /> Add Business Income
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (BDT)</label>
              <Input type="number" placeholder="0" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11">
                <option>Sales Revenue</option>
                <option>Investment Returns</option>
                <option>Service Income</option>
                <option>Other Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input placeholder="Enter description" className="h-11" />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">Record Income</Button>
          </form>
        </Card>

        {/* Expense Form */}
        <Card className="p-6 border-2 border-red-200 bg-red-50/30">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
            <Minus size={20} /> Add Business Expense
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (BDT)</label>
              <Input type="number" placeholder="0" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11">
                <option>Operations</option>
                <option>Marketing</option>
                <option>Staff Salary</option>
                <option>Utilities</option>
                <option>Other Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input placeholder="Enter description" className="h-11" />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">Record Expense</Button>
          </form>
        </Card>
      </div>

      {/* Operations Log */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Operations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op.id} className="border-b hover:bg-muted/50 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {op.type === "Business Income" ? (
                        <Plus className="text-green-600" size={16} />
                      ) : (
                        <Minus className="text-red-600" size={16} />
                      )}
                      {op.type}
                    </div>
                  </td>
                  <td className="py-3">{op.category}</td>
                  <td
                    className={`py-3 text-right font-semibold ${op.type === "Business Income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {op.type === "Business Income" ? "+" : "-"}৳ {op.amount}
                  </td>
                  <td className="py-3 text-muted-foreground">{op.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
