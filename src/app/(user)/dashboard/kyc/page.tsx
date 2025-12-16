"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award as IdCard,
  Plane,
  Car,
  Shield,
  Eye,
  Home,
  Loader2,
} from "lucide-react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";
import { useUser } from "@/providers/UserProvider";

type DocumentType = "nid" | "passport" | "drivingLicence" | "addressProof";

const KycVerificationPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<DocumentType>("nid");
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<DocumentType, { front?: string; back?: string }>
  >({
    nid: {},
    passport: {},
    drivingLicence: {},
    addressProof: {},
  });

  const [formData, setFormData] = useState({
    documentNumber: "",
    issueDate: "",
    expiryDate: "",
    documentDate: "",
    addressProofType: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    {
      id: "addressProof" as DocumentType,
      label: "Address Proof",
      icon: Home,
      description: "Upload utility bill or bank statement",
    },
  ];

  const handleFileUpload = async (
    type: DocumentType,
    side: "front" | "back",
    file: File
  ) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { payload } = await uploadToCloudinary(formData);
      console.log({ payload });

      setUploadedFiles((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [side]: payload?.file?.fileUrl,
        },
      }));
      toast("Upload successful", {
        description: "Image uploaded to Cloudinary successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast("Upload failed", {
        description:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!uploadedFiles[activeTab]?.front) {
        toast("Missing document", {
          description: "Please upload at least the front side of your document",
        });
        return;
      }

      if (activeTab !== "addressProof" && !formData.documentNumber) {
        toast("Missing information", {
          description: "Please enter your document number",
        });
        return;
      }

      setIsSubmitting(true);

      const submissionData = {
        userId: user?._id,
        [activeTab]: {
          number: formData.documentNumber,
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate,
          documentDate: formData.documentDate,
          addressProofType: formData.addressProofType,
          front:
            uploadedFiles[activeTab].front || uploadedFiles[activeTab].front,
          back: uploadedFiles[activeTab].back || uploadedFiles[activeTab].back,
        },
      };

      console.log("Submitting KYC data:", submissionData);

      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Submission failed");
      }

      toast("Verification submitted", {
        description: "Your documents have been submitted for verification",
      });

      setUploadedFiles((prev) => ({ ...prev, [activeTab]: {} }));
      setFormData({
        documentNumber: "",
        issueDate: "",
        expiryDate: "",
        documentDate: "",
        addressProofType: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast("Submission failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit verification",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeDocument = documentTypes.find((doc) => doc.id === activeTab)!;
  const Icon = activeDocument.icon;

  console.log({ uploadedFiles });

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
          {documentTypes.map((doc) => {
            const DocIcon = doc.icon;
            const isActive = activeTab === doc.id;

            return (
              <button
                key={doc.id}
                onClick={() => setActiveTab(doc.id)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
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

        <Card className="max-w-4xl mx-auto p-8 md:p-12 border-2 shadow-xl">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {activeTab === "addressProof"
                  ? "Document Upload"
                  : "Front Side"}
              </Label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(activeTab, "front", file);
                  }}
                  className="hidden"
                  id={`${activeTab}-front`}
                  disabled={isUploading}
                />
                <label
                  htmlFor={`${activeTab}-front`}
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 bg-muted/50"
                >
                  {uploadedFiles[activeTab]?.front ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          uploadedFiles[activeTab].front || "/placeholder.svg"
                        }
                        width={200}
                        height={200}
                        alt="Front"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      {isUploading ? (
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                      ) : (
                        <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      )}
                      <span className="text-sm font-medium text-muted-foreground">
                        {isUploading
                          ? "Uploading..."
                          : activeTab === "addressProof"
                          ? "Click to upload document"
                          : "Click to upload front side"}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {activeTab !== "passport" && activeTab !== "addressProof" && (
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Back Side
                </Label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(activeTab, "back", file);
                    }}
                    className="hidden"
                    id={`${activeTab}-back`}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor={`${activeTab}-back`}
                    className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 bg-muted/50"
                  >
                    {uploadedFiles[activeTab]?.back ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            uploadedFiles[activeTab].back || "/placeholder.svg"
                          }
                          width={200}
                          height={200}
                          alt="Back"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        {isUploading ? (
                          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                        ) : (
                          <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                        )}
                        <span className="text-sm font-medium text-muted-foreground">
                          {isUploading
                            ? "Uploading..."
                            : "Click to upload back side"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 10MB
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 mb-8">
            {activeTab !== "addressProof" && (
              <div className="space-y-2">
                <Label
                  htmlFor="document-number"
                  className="text-base font-semibold"
                >
                  Document Number
                </Label>
                <Input
                  id="document-number"
                  placeholder={`Enter your ${activeDocument.label.toLowerCase()} number`}
                  className="h-12 text-base"
                  value={formData.documentNumber}
                  onChange={(e) =>
                    handleInputChange("documentNumber", e.target.value)
                  }
                />
              </div>
            )}

            {activeTab === "addressProof" ? (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="document-type"
                    className="text-base font-semibold"
                  >
                    Document Type
                  </Label>
                  <Input
                    id="document-type"
                    placeholder="e.g., Utility Bill, Bank Statement, Rental Agreement"
                    className="h-12 text-base"
                    value={formData.addressProofType}
                    onChange={(e) =>
                      handleInputChange("addressProofType", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="document-date"
                    className="text-base font-semibold"
                  >
                    Document Date
                  </Label>
                  <Input
                    id="document-date"
                    type="date"
                    className="h-12 text-base"
                    value={formData.documentDate}
                    onChange={(e) =>
                      handleInputChange("documentDate", e.target.value)
                    }
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="issue-date"
                    className="text-base font-semibold"
                  >
                    Issue Date
                  </Label>
                  <Input
                    id="issue-date"
                    type="date"
                    className="h-12 text-base"
                    value={formData.issueDate}
                    onChange={(e) =>
                      handleInputChange("issueDate", e.target.value)
                    }
                  />
                </div>
                {activeTab !== "nid" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="expiry-date"
                      className="text-base font-semibold"
                    >
                      Expiry Date
                    </Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      className="h-12 text-base"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange("expiryDate", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 mb-8">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">Verification Guidelines</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>Ensure all text is clearly visible and readable</li>
                <li>Avoid glare, shadows, or blurry images</li>
                {activeTab === "addressProof" ? (
                  <li>Document must be issued within the last 3 months</li>
                ) : (
                  <li>Document should be valid and not expired</li>
                )}
                <li>Photos should show the full document within the frame</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 h-12 text-base bg-transparent"
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button
              className="flex-1 h-12 text-base shadow-lg shadow-primary/25"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submit for Verification
                </>
              )}
            </Button>
          </div>
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
