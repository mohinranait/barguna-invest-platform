"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Upload, Eye, Download } from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Ahmed Rahman",
    email: "ahmed@example.com",
    phone: "+880 1712345678",
    dateOfBirth: "1990-05-15",
    nid: "1234567890123",
    address: "123 Main Street, Dhaka",
  });

  const [bankInfo, setBankInfo] = useState({
    accountHolder: "Ahmed Rahman",
    accountNumber: "••••••••5678",
    bankName: "Bangladesh Bank",
    accountType: "Savings",
  });

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

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <React.Fragment>
      <UserContainer className="pt-4 pb-8">
        <UserHeader />
        <div className=" space-y-5 pt-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground ">
                Manage your account information and KYC documents
              </p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "" : "bg-primary hover:bg-primary/90"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <X className="mr-2" size={20} />
              ) : (
                <Edit2 className="mr-2" size={20} />
              )}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  value={profileData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  disabled={!isEditing}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  disabled={!isEditing}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  National ID
                </label>
                <Input
                  value={profileData.nid}
                  onChange={(e) => handleInputChange("nid", e.target.value)}
                  disabled={!isEditing}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <Input
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  className="h-11"
                />
              </div>
            </div>
            {isEditing && (
              <Button
                onClick={handleSave}
                className="mt-6 bg-primary hover:bg-primary/90"
              >
                <Save className="mr-2" size={20} />
                Save Changes
              </Button>
            )}
          </Card>

          {/* Bank Information */}
          <Card className="p-6 border-2 border-secondary/20">
            <h2 className="text-lg font-semibold mb-6">
              Bank & Mobile Banking Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Holder Name
                </label>
                <Input
                  value={bankInfo.accountHolder}
                  disabled
                  className="h-11 bg-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Number
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={bankInfo.accountNumber}
                    disabled
                    className="h-11 bg-muted/50"
                  />
                  <Button variant="outline" size="sm">
                    <Eye size={16} />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bank Name
                </label>
                <Input
                  value={bankInfo.bankName}
                  disabled
                  className="h-11 bg-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Type
                </label>
                <Input
                  value={bankInfo.accountType}
                  disabled
                  className="h-11 bg-muted/50"
                />
              </div>
            </div>
            <Button variant="outline" className="mt-6 bg-transparent">
              Update Banking Information
            </Button>
          </Card>

          {/* KYC Documents */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">KYC Documents</h2>
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
              <Upload
                className="mx-auto mb-4 text-muted-foreground"
                size={32}
              />
              <p className="font-medium mb-2">Upload Additional Documents</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop or click to select
              </p>
              <Button variant="outline">Choose File</Button>
            </div>
          </Card>

          {/* Verification Status */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card rounded">
                <span className="text-sm font-medium">Email Verification</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded">
                <span className="text-sm font-medium">Phone Verification</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded">
                <span className="text-sm font-medium">KYC Verification</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Pending Review
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded">
                <span className="text-sm font-medium">
                  Bank Account Verification
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Verified
                </span>
              </div>
            </div>
          </Card>
        </div>
      </UserContainer>
    </React.Fragment>
  );
}
