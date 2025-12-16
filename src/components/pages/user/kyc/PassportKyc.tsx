import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useUser } from "@/providers/UserProvider";
import { IKyc, IPassportAndLicence } from "@/types/kyc.type";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  selectedKyc: IKyc | undefined;
};
const PassportKyc = ({ selectedKyc }: Props) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<IPassportAndLicence>({
    number: "",
    verify: false,
    front: "",
    back: "",
    issueDate: null,
    expireDate: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (side: "front" | "back", file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { payload } = await uploadToCloudinary(formData);

      setFormData((prev) => ({
        ...prev,
        [side]: payload?.file?.fileUrl,
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

  const handleSubmit = async () => {
    try {
      if (!formData?.front) {
        toast("Missing document", {
          description: "Please upload at least the front side of your document",
        });
        return;
      }

      setIsSubmitting(true);

      const response = await fetch("/api/member/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: user?._id, passport: formData }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Submission failed");
      }

      toast("Verification submitted", {
        description: "Your documents have been submitted for verification",
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

  useEffect(() => {
    if (!selectedKyc) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      ...selectedKyc.passport,
    }));
  }, [selectedKyc]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <Label className=" flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Front Side
          </Label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("front", file);
              }}
              className="hidden"
              id={`pass-front`}
              disabled={isUploading}
            />
            <label
              htmlFor={`pass-front`}
              className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 bg-muted/50"
            >
              {formData?.front ? (
                <div className="relative w-full h-full">
                  <Image
                    src={formData.front || "/placeholder.svg"}
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
      </div>

      <div className="space-y-6 ">
        <div className="space-y-2">
          <Label htmlFor="document-number" className="">
            Passport Number
          </Label>
          <Input
            id="document-number"
            placeholder={`Enter your passport number`}
            className="h-12 text-base"
            value={formData.number}
            onChange={(e) => handleInputChange("number", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="issue-date" className=" ">
              Issue Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!formData.issueDate}
                  className="data-[empty=true]:text-muted-foreground w-full h-11 justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {formData.issueDate ? (
                    format(formData.issueDate, "MMM dd, yyyy")
                  ) : (
                    <span>Select issue date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.issueDate as Date}
                  onSelect={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issueDate: e as Date,
                    }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry-date" className="">
              Expiry Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!formData.expireDate}
                  className="data-[empty=true]:text-muted-foreground w-full h-11 justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {formData.expireDate ? (
                    format(formData.expireDate, "MMM dd, yyyy")
                  ) : (
                    <span>Select expiry date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expireDate as Date}
                  onSelect={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expireDate: e as Date,
                    }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 ">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400  mt-0.5" />
        <div className="text-sm text-blue-900 dark:text-blue-100">
          <p className="font-semibold mb-1">Verification Guidelines</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
            <li>Ensure all text is clearly visible and readable</li>
            <li>Avoid glare, shadows, or blurry images</li>
            <li>Document should be valid and not expired</li>
            <li>Photos should show the full document within the frame</li>
          </ul>
        </div>
      </div>

      <div className="">
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
    </>
  );
};

export default PassportKyc;
