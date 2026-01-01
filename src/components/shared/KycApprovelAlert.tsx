"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangleIcon, XCircleIcon } from "lucide-react";
import { useUser } from "@/providers/UserProvider";

const KycApprovalAlert = () => {
  const { user } = useUser();

  // Approved → no alert
  if (user?.kycStatus === "approved") {
    return null;
  }

  // KYC Not Submitted / Pending
  if (!user?.kycStatus || user?.kycStatus === "pending") {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800">KYC Required</AlertTitle>
        <AlertDescription className="text-yellow-700">
          You have not completed your KYC verification yet. Please submit your
          KYC information to continue using all features.
        </AlertDescription>
      </Alert>
    );
  }

  // KYC Rejected
  if (user?.kycStatus === "rejected") {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircleIcon className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-800">KYC Rejected</AlertTitle>
        <AlertDescription className="text-red-700">
          Your KYC verification was rejected. Please update your documents and
          submit again.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default KycApprovalAlert;
