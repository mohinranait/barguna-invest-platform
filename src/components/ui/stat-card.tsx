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
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      {change && <p className={`text-xs ${changeColor}`}>{change}</p>}
    </Card>
  );
}

export default StatCard;
