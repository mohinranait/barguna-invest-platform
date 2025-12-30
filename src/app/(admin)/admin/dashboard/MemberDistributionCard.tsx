"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const MemberDistributionCard = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Member Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={[
              { name: "Active", value: 320 },
              { name: "Pending KYC", value: 20 },
              { name: "Inactive", value: 8 },
            ]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={100}
            dataKey="value"
          >
            <Cell fill="var(--primary)" />
            <Cell fill="var(--secondary)" />
            <Cell fill="var(--muted)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MemberDistributionCard;
