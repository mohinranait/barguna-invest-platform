import type React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  highlight?: boolean;
}

export function StatCard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
}: StatCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <Card className="p-6 gap-0 backdrop-blur-3xl  ">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary">{icon}</div>
        <p className="text-sm font-medium text-muted-foreground ">{label}</p>
      </div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      {change && <p className={`text-xs ${changeColor}`}>{change}</p>}
    </Card>
  );
}

export default StatCard;
