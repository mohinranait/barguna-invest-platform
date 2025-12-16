"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, Download, IdCard, LucideProps, Plane } from "lucide-react";
import { IKyc } from "@/types/kyc.type";

type KycDocId = "nid" | "passport" | "drivingLicence";
type TIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

const KycVerifyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [kyc, setKyc] = useState<IKyc | undefined>();

  /* ------------------ STATUS LOGIC ------------------ */
  const getKycStatus = (kyc: IKyc | undefined, id: KycDocId) => {
    // key missing
    if (!kyc || !kyc[id]) {
      return "Give Data";
    }

    const doc = kyc[id];

    // verified
    if (doc.verify) {
      return "Verified";
    }

    // NID rules
    if (id === "nid") {
      const docNid = kyc[id];
      if (
        !docNid.nidNumber?.trim() ||
        !docNid.front?.trim() ||
        !docNid.back?.trim()
      ) {
        return "Need more";
      }
    }

    // Passport / Driving Licence rules
    if (id !== "nid") {
      const doc = kyc[id];
      if (
        !doc.number?.trim() ||
        !doc.front?.trim() ||
        !doc.issueDate ||
        !doc.expireDate
      ) {
        return "Need more";
      }
    }

    return "Pending";
  };

  // Document list
  const documents: { id: KycDocId; name: string; icon: TIcon }[] = [
    { id: "nid", name: "NID Card", icon: IdCard },
    { id: "passport", name: "Passport", icon: Plane },
    { id: "drivingLicence", name: "Driving Licence", icon: Car },
  ];

  // Fetch KYC
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
        setKyc(data.kyc);
      }
    } catch (err) {
      console.error("Fetch KYC error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between ">
        <h2 className="text-lg font-semibold">KYC Documents</h2>
        <Link href="/dashboard/kyc">
          <Button>Update KYC</Button>
        </Link>
      </div>

      <div className="space-y-4 mb-8">
        {documents.map((doc) => {
          const status = getKycStatus(kyc, doc.id);
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              className="sm:flex gap-3 items-center justify-between p-4 bg-muted/30 rounded-lg border"
            >
              <div className="sm:flex items-center gap-2">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg  transition-all duration-300  bg-primary/10 text-primary">
                  <Icon />
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {status === "Give Data"
                      ? "No data submitted"
                      : "Document submitted"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : status === "Need more"
                      ? "bg-sky-100 text-sky-700"
                      : status === "Give Data"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {status}
                </span>

                <div className="w-8">
                  {status !== "Give Data" && (
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default KycVerifyComponent;
