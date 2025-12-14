import KycVerifyComponent from "@/components/pages/user/KycVerifyComponent";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import React from "react";

const KycVerificationPage = () => {
  return (
    <UserContainer className="pt-4 pb-8">
      <UserHeader />
      <div className=" space-y-5 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">KYC documents</h1>
            <p className="text-muted-foreground ">
              Manage your account information and KYC documents
            </p>
          </div>
        </div>

        {/* KYC Documents */}
        <KycVerifyComponent />
      </div>
    </UserContainer>
  );
};

export default KycVerificationPage;
