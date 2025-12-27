import React, { Dispatch, SetStateAction, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Download, FileText, X } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { IKyc } from "@/types/kyc.type";
import { FormDataType } from "@/app/(admin)/admin/members/kyc-verification/page";
import { Label } from "../ui/label";

type KycModalProps = {
  selectedKyc: IKyc | null;
  setSelectedKyc: Dispatch<SetStateAction<IKyc | null>>;
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  callBack?: () => void;
};

const KycModal = ({
  selectedKyc,
  setSelectedKyc,
  formData,
  setFormData,
  callBack,
}: KycModalProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUpdateKycStatus = async () => {
    try {
      let data = {
        ...selectedKyc,
      };

      if (selectedKyc?.nid) {
        data = {
          ...data,
          nid: { ...selectedKyc.nid, ...formData.nid },
        };
      }
      if (selectedKyc?.passport) {
        data = {
          ...data,
          passport: { ...selectedKyc.passport, ...formData.passport },
        };
      }
      if (selectedKyc?.drivingLicence) {
        data = {
          ...data,
          drivingLicence: {
            ...selectedKyc.drivingLicence,
            ...formData.drivingLicence,
          },
        };
      }

      await fetch(`/api/admin/kyc/${selectedKyc?._id}`, {
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

      setSelectedKyc(null);
      if (callBack) callBack();
    } catch (error) {
      console.log({ error });
    }
  };
  if (!selectedKyc) return null;
  return (
    <React.Fragment>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl gap-2 p-0">
          {/* Header */}
          <div className="p-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">
              {selectedKyc.userId.fullName} - KYC
            </h2>
            <Button variant="ghost" onClick={() => setSelectedKyc(null)}>
              <X />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {(["nid", "passport", "drivingLicence"] as const).map(
              (doc) =>
                selectedKyc[doc] && (
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
                            setPreviewImage(selectedKyc[doc].front)
                          }
                        >
                          <Image
                            src={selectedKyc[doc].front}
                            fill
                            alt="front"
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Back */}
                      {selectedKyc[doc].back && (
                        <div>
                          <p className="text-xs mb-2 uppercase text-muted-foreground">
                            Back
                          </p>
                          <div
                            className="relative h-48 border rounded-lg bg-muted/40 cursor-zoom-in"
                            onClick={() =>
                              setPreviewImage(selectedKyc[doc].back)
                            }
                          >
                            <Image
                              src={selectedKyc[doc].back}
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
              Update Status
            </Button>
          </div>
        </Card>
      </div>

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
    </React.Fragment>
  );
};

export default KycModal;
