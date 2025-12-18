"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Download,
  FileText,
  AlertCircle,
  X,
  HardDrive,
} from "lucide-react";
import { IKyc } from "@/types/kyc.type";
import { format } from "date-fns";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function KYCVerificationPage() {
  const [kycRequests, setKycRequests] = useState<IKyc[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<IKyc | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nid: {
      verify: true,
      note: "",
    },
    passport: {
      verify: true,
      note: "",
    },
    drivingLicence: {
      verify: true,
      note: "",
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "Need NID":
      case "Need Passport":
      case "Need Licence":
        return <AlertCircle className="text-orange-600" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  useEffect(() => {
    fetchKycs();
  }, []);

  const fetchKycs = async () => {
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setKycRequests(data?.kycs || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handle update kyc status
  const handleUpdateKycStatus = async () => {
    console.log({ formData });

    try {
      let data = {
        ...selectedRequest,
      };

      if (selectedRequest?.nid) {
        data = {
          ...data,
          nid: { ...selectedRequest.nid, ...formData.nid },
        };
      }
      if (selectedRequest?.passport) {
        data = {
          ...data,
          passport: { ...selectedRequest.passport, ...formData.passport },
        };
      }
      if (selectedRequest?.drivingLicence) {
        data = {
          ...data,
          drivingLicence: {
            ...selectedRequest.drivingLicence,
            ...formData.drivingLicence,
          },
        };
      }

      await fetch(`/api/admin/kyc/${selectedRequest?._id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "Application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          status: "Verified",
        }),
      });

      setSelectedRequest(null);
      fetchKycs();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground mt-1">
          Review and verify member KYC documents
        </p>
      </div>

      {/* KYC Requests */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Pending KYC Requests ({kycRequests?.length}){" "}
        </h2>

        <div className="space-y-4">
          {kycRequests?.length === 0 && (
            <Empty className="from-muted/50 to-background h-full  from-30%">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HardDrive />
                </EmptyMedia>
                <EmptyTitle>No KYC requests</EmptyTitle>
                <EmptyDescription>
                  You&apos;re all caught up. New KYC will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {kycRequests.map((req) => (
            <div
              key={req._id}
              className="p-4 border rounded-lg hover:bg-muted/30 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(req.status)}
                  <div>
                    <p className="font-semibold">{req.userId.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted:{" "}
                      {format(new Date(req.updatedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                  {req.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Documents Submitted:</p>
                <div className="flex flex-wrap gap-2">
                  {(["nid", "passport", "drivingLicence"] as const).map(
                    (doc) =>
                      req[doc] && (
                        <span
                          key={doc}
                          className="inline-flex capitalize items-center gap-1 px-3 py-1 bg-muted rounded text-xs"
                        >
                          <FileText size={12} />
                          {doc}
                        </span>
                      )
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRequest(req)}
              >
                Review Documents
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Viewer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl gap-2 p-0">
            {/* Header */}
            <div className="p-4 py-3 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">
                {selectedRequest.userId.fullName} - KYC
              </h2>
              <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
                <X />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {(["nid", "passport", "drivingLicence"] as const).map(
                (doc) =>
                  selectedRequest[doc] && (
                    <div key={doc} className="p-5 space-y-3 border rounded-xl ">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileText className="text-primary" />
                          <p className="font-semibold capitalize">{doc}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download size={14} /> Download
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Front */}
                        <div>
                          <p className="text-xs mb-2 uppercase text-muted-foreground">
                            Front
                          </p>
                          <div
                            className="relative h-48 border rounded-lg bg-muted/40 cursor-zoom-in"
                            onClick={() =>
                              setPreviewImage(selectedRequest[doc].front)
                            }
                          >
                            <Image
                              src={selectedRequest[doc].front}
                              fill
                              alt="front"
                              className="object-contain"
                            />
                          </div>
                        </div>

                        {/* Back */}
                        {selectedRequest[doc].back && (
                          <div>
                            <p className="text-xs mb-2 uppercase text-muted-foreground">
                              Back
                            </p>
                            <div
                              className="relative h-48 border rounded-lg bg-muted/40 cursor-zoom-in"
                              onClick={() =>
                                setPreviewImage(selectedRequest[doc].back)
                              }
                            >
                              <Image
                                src={selectedRequest[doc].back}
                                fill
                                alt="back"
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Select
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              [doc]: { ...prev[doc], verify: value === "true" },
                            }));
                          }}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select a field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Approved</SelectItem>
                            <SelectItem value="false">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        {!formData[doc].verify && (
                          <div className="space-y-1">
                            <Label>Rejected Reasone</Label>
                            <Textarea
                              value={formData[doc].note}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [doc]: { ...prev[doc], note: e.target.value },
                                }));
                              }}
                              placeholder="Type rejection message..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>

            {/* Footer */}
            <div className="p-4 py-2 border-t flex items-center justify-between">
              <Button type="button" onClick={handleUpdateKycStatus}>
                Update
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Full Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[85vh] bg-background rounded-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute z-100 cursor-pointer top-3 right-3 p-2 rounded-full bg-muted"
              type="button"
              onClick={() => setPreviewImage(null)}
            >
              <X size={18} />
            </button>

            <div className="relative w-full h-full">
              <Image
                src={previewImage}
                fill
                alt="Preview"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
