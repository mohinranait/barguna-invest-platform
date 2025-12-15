"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const KycVerifyComponent = () => {
  const [kycDocuments, setKycDocuments] = useState([
    { id: 1, name: "NID Card", status: "Verified", uploadDate: "Dec 1, 2024" },
    { id: 2, name: "Passport", status: "Pending", uploadDate: "Dec 1, 2024" },
    {
      id: 3,
      name: "Address Proof",
      status: "Verified",
      uploadDate: "Nov 28, 2024",
    },
  ]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold ">KYC Documents</h2>
        <Link href={"/dashboard/kyc"}>
          <Button type="button">Update KYC</Button>
        </Link>
      </div>
      <div className="space-y-4 mb-6">
        {kycDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
          >
            <div>
              <p className="font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                Uploaded: {doc.uploadDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  doc.status === "Verified"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {doc.status}
              </span>
              <Button variant="ghost" size="sm">
                <Download size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Upload className="mx-auto mb-4 text-muted-foreground" size={32} />
        <p className="font-medium mb-2">Upload Additional Documents</p>
        <p className="text-sm text-muted-foreground mb-4">
          Drag & drop or click to select
        </p>
        <Button variant="outline">Choose File</Button>
      </div>
    </Card>
  );
};

export default KycVerifyComponent;
