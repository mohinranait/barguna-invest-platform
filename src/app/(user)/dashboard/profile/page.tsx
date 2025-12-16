"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, CalendarIcon } from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { useUser } from "@/providers/UserProvider";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import KycVerifyComponent from "@/components/pages/user/kyc/KycVerifyComponent";
import { IKyc } from "@/types/kyc.type";

type IUserFrom = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | null;
  address: string;
};

type KycDocId = "nid" | "passport" | "drivingLicence";

const getKycCompletion = (kyc: IKyc) => {
  if (!kyc) return 0;

  const docs: KycDocId[] = ["nid", "passport", "drivingLicence"];
  let verifiedCount = 0;

  docs.forEach((doc) => {
    if (kyc[doc]?.verify === true) {
      verifiedCount++;
    }
  });

  return Math.round((verifiedCount / docs.length) * 100);
};

const getKycStatusText = (percent: number) => {
  if (percent === 100) return "Verified";
  if (percent === 0) return "Not Started";
  return `${percent}% Complete`;
};

const getKycBadgeClass = (percent: number) => {
  if (percent === 100) {
    return "bg-green-100 text-green-700";
  }
  if (percent >= 50) {
    return "bg-sky-100 text-sky-700";
  }
  return "bg-yellow-100 text-yellow-700";
};

export default function ProfilePage() {
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [kyc, setKyc] = useState<IKyc | null>(null);

  const [profileData, setProfileData] = useState<IUserFrom>({
    fullName: "",
    email: user?.email as string,
    phone: "",
    dateOfBirth: null,
    address: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/member/kyc", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setKyc(data.kyc))
      .catch(() => {});
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profileData.fullName.trim()) {
      setError("Name field is required");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/member/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "Update failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const kycPercent = getKycCompletion(kyc as IKyc);
  const kycText = getKycStatusText(kycPercent);
  const kycBadgeClass = getKycBadgeClass(kycPercent);

  return (
    <UserContainer className="pt-4 pb-8">
      <UserHeader />

      <div className="space-y-5 pt-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and KYC documents
          </p>
        </div>

        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X size={18} /> : <Edit2 size={18} />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 mt-4">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                disabled={!isEditing}
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={profileData.email} disabled readOnly />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                disabled={!isEditing}
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={!isEditing}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <CalendarIcon className="mr-2" />
                    {profileData.dateOfBirth
                      ? format(profileData.dateOfBirth, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={profileData.dateOfBirth as Date}
                    onSelect={(date) =>
                      setProfileData((p) => ({
                        ...p,
                        dateOfBirth: date as Date,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Address</label>
            <Input
              disabled={!isEditing}
              value={profileData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="mt-6" disabled={submitting}>
              <Save className="mr-2" size={18} />
              Save Changes
            </Button>
          )}
        </Card>

        {/* KYC Documents */}
        <KycVerifyComponent />

        {/* Verification Status */}
        <Card className="p-6 bg-primary/5 gap-0 border-primary/20">
          <h2 className="text-lg font-semibold mb-4">Verification Status</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card rounded">
              <span className="text-sm font-medium">Email Verification</span>
              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-card rounded">
              <span className="text-sm font-medium">Phone Verification</span>
              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-card rounded">
              <span className="text-sm font-medium">KYC Verification</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${kycBadgeClass}`}
              >
                {kycText}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </UserContainer>
  );
}
