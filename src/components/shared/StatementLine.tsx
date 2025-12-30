import { format } from "date-fns";
import { Calendar, Download, FileText } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { connectDB } from "@/lib/db";
import { Distribution } from "@/models/distribution.model";
import { IDistribution } from "@/types/distribution.type";

const StatementLine = async () => {
  await connectDB();

  const getStatements = await Distribution.find({})
    .limit(10)
    .sort({ createdAt: -1 })
    .lean();
  const distributions: IDistribution[] = JSON.parse(
    JSON.stringify(getStatements)
  );

  return (
    <div className="space-y-3">
      {distributions.map((stmt, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition border"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <p className="font-semibold">
                {format(new Date(stmt?.createdAt), "MMMM yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                <Calendar className="inline mr-1" size={14} />
                {format(new Date(stmt?.createdAt), "MMM dd, yyyy")} •
                Distributed to {stmt.members} members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-green-600">৳ {stmt.amount}</p>
              <p className="text-xs text-muted-foreground">{stmt.status}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download size={16} /> PDF
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatementLine;
