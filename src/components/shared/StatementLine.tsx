import React from "react";
import { connectDB } from "@/lib/db";
import { Distribution } from "@/models/distribution.model";
import { IDistribution } from "@/types/distribution.type";
import StatementCard from "./StatementCard";

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
        <StatementCard key={i} stmt={stmt} />
      ))}
    </div>
  );
};

export default StatementLine;
