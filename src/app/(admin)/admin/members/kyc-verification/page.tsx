"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, AlertCircle, HardDrive } from "lucide-react";
import { IKyc } from "@/types/kyc.type";
import { format } from "date-fns";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import KycModal from "@/components/shared/KycModal";

export type FormDataType = {
  nid: {
    verify: boolean;
    note: string;
  };
  passport: {
    verify: boolean;
    note: string;
  };
  drivingLicence: {
    verify: boolean;
    note: string;
  };
};
export default function KYCVerificationPage() {
  const [selectedKyc, setSelectedKyc] = useState<IKyc | null>(null);
  const [kycRequests, setKycRequests] = useState<IKyc[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
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
    fetchKycs();
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
                onClick={() => setSelectedKyc(req)}
              >
                Review Documents
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Viewer Modal */}
      {selectedKyc && (
        <KycModal
          selectedKyc={selectedKyc}
          setSelectedKyc={setSelectedKyc}
          formData={formData}
          setFormData={setFormData}
          callBack={handleUpdateKycStatus}
        />
      )}
    </div>
  );
}
