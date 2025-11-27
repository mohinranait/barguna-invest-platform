"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Download, FileText, AlertCircle } from "lucide-react"

const kycRequests = [
  {
    id: 1,
    memberName: "Rahman Ahmed",
    submitDate: "Nov 28, 2024",
    documents: ["NID Card", "Address Proof", "Bank Statement"],
    status: "Pending Review",
    urgency: "normal",
  },
  {
    id: 2,
    memberName: "Sara Islam",
    submitDate: "Nov 25, 2024",
    documents: ["Passport", "Utility Bill", "Bank Account"],
    status: "Pending Review",
    urgency: "high",
  },
  {
    id: 3,
    memberName: "Ali Hassan",
    submitDate: "Nov 20, 2024",
    documents: ["NID Card", "Trade License"],
    status: "Needs Clarification",
    urgency: "urgent",
  },
]

export default function KYCVerificationPage() {
  const [selectedRequest, setSelectedRequest] = useState<(typeof kycRequests)[0] | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Review":
        return <Clock className="text-yellow-600" size={20} />
      case "Needs Clarification":
        return <AlertCircle className="text-orange-600" size={20} />
      default:
        return <Clock className="text-gray-400" size={20} />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground mt-1">Review and verify member KYC documents</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Pending Review</div>
          <div className="text-3xl font-bold">2</div>
          <div className="text-xs text-yellow-600 mt-2">Awaiting verification</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Needs Clarification</div>
          <div className="text-3xl font-bold">1</div>
          <div className="text-xs text-orange-600 mt-2">Additional docs needed</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">This Week</div>
          <div className="text-3xl font-bold">{kycRequests.length}</div>
          <div className="text-xs text-muted-foreground mt-2">Submissions</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground mb-2">Avg Processing</div>
          <div className="text-3xl font-bold">2.5</div>
          <div className="text-xs text-muted-foreground mt-2">Days</div>
        </Card>
      </div>

      {/* KYC Requests */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Pending KYC Requests</h2>
        <div className="space-y-4">
          {kycRequests.map((req) => (
            <div key={req.id} className="p-4 border rounded-lg hover:bg-muted/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(req.status)}
                  <div>
                    <p className="font-semibold">{req.memberName}</p>
                    <p className="text-xs text-muted-foreground">Submitted: {req.submitDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(req.urgency)}`}
                  >
                    {req.urgency.toUpperCase()}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Documents Submitted:</p>
                <div className="flex flex-wrap gap-2">
                  {req.documents.map((doc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded text-xs">
                      <FileText size={12} />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                  Review Documents
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-1" size={16} />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <XCircle className="mr-1" size={16} />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* KYC Document Viewer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-card border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedRequest.memberName} - KYC Documents</h2>
              <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {selectedRequest.documents.map((doc, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="text-primary" size={24} />
                      <div>
                        <p className="font-semibold">{doc}</p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">Document preview would appear here</p>
                  </div>
                </div>
              ))}

              {/* Verification Form */}
              <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-4">Verification Notes</h3>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm h-24 resize-none"
                  placeholder="Add verification notes or rejection reason..."
                />

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedRequest(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2" size={16} />
                    Approve KYC
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <XCircle className="mr-2" size={16} />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
