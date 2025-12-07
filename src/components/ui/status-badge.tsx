import type React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?:
    | "active"
    | "approved"
    | "pending"
    | "completed"
    | "failed"
    | "warning"
    | "verified"
    | "rejected"
    | "success"
    | "error"
    | "cancel";
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  status = "pending",
  children,
  size = "md",
}: StatusBadgeProps) {
  const statusMap = {
    active: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
    warning: "bg-orange-100 text-orange-700",
    verified: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    cancel: "bg-red-100 text-red-700",
  };

  const sizeMap = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-block font-medium rounded-full capitalize",
        statusMap[status],
        sizeMap[size]
      )}
    >
      {children || status}
    </span>
  );
}

export default StatusBadge;
