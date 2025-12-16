"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Award as IdCard,
  Plane,
  Car,
  Shield,
} from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

import PassportKyc from "@/components/pages/user/kyc/PassportKyc";
import LicenceKyc from "@/components/pages/user/kyc/LicenceKyc";
import NidKyc from "@/components/pages/user/kyc/NidKyc";
import { IKyc } from "@/types/kyc.type";

export type DocumentType =
  | "nid"
  | "passport"
  | "drivingLicence"
  | "addressProof";

const KycVerificationPage = () => {
  const [activeTab, setActiveTab] = useState<DocumentType>("nid");
  const [selectedKyc, setSelectedKyc] = useState<IKyc>();
  const [loading, setLoading] = useState<boolean>(false);

  const documentTypes = [
    {
      id: "nid" as DocumentType,
      label: "National ID Card",
      icon: IdCard,
      description: "Upload your national identity card",
    },
    {
      id: "passport" as DocumentType,
      label: "Passport",
      icon: Plane,
      description: "Upload your passport document",
    },
    {
      id: "drivingLicence" as DocumentType,
      label: "Driving License",
      icon: Car,
      description: "Upload your driving license",
    },
  ];

  useEffect(() => {
    fetchKyc();
  }, []);

  const fetchKyc = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/member/kyc", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedKyc(data.kyc);
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeDocument = documentTypes.find((doc) => doc.id === activeTab)!;
  const Icon = activeDocument.icon;

  return (
    <UserContainer className="space-y-5 pt-4 pb-6">
      <UserHeader />
      <div>
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-xl flex items-center gap-3 md:text-3xl font-bold mb-4 text-balance">
            <Shield className="w-8 h-8 text-primary" />
            Identity Verification
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl  text-pretty">
            Secure your account by verifying your identity. Choose a document
            type and upload clear photos for quick verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-6xl mx-auto">
          {documentTypes.map((doc) => {
            const DocIcon = doc.icon;
            const isActive = activeTab === doc.id;

            return (
              <button
                key={doc.id}
                onClick={() => setActiveTab(doc.id)}
                className={`group relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 text-left ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-none shadow-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <DocIcon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{doc.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {doc.description}
                </p>
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <Card className="max-w-4xl mx-auto p-8 md:p-12 border shadow-none">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{activeDocument.label}</h2>
            </div>
            <p className="text-muted-foreground">
              Please upload clear, high-quality images of your document. Make
              sure all information is visible and readable.
            </p>
          </div>

          {activeDocument?.id === "passport" && (
            <PassportKyc selectedKyc={selectedKyc} />
          )}
          {activeDocument?.id === "drivingLicence" && (
            <LicenceKyc selectedKyc={selectedKyc} />
          )}
          {activeDocument?.id === "nid" && <NidKyc selectedKyc={selectedKyc} />}
        </Card>

        <div className="text-center mt-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>
              Your documents are encrypted and securely stored. We never share
              your personal information.
            </span>
          </div>
        </div>
      </div>
    </UserContainer>
  );
};

export default KycVerificationPage;
