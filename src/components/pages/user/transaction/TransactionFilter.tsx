"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TransactionFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    value ? newParams.set(key, value) : newParams.delete(key);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-3 gap-4">
        {/* SEARCH */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Search Amount
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-muted-foreground"
              size={18}
            />
            <Input
              defaultValue={params.get("search") || ""}
              placeholder="Search amount..."
              className="pl-9"
              onBlur={(e) => updateParam("search", e.target.value)}
            />
          </div>
        </div>

        {/* DATE */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <Input
            type="date"
            defaultValue={params.get("from") || ""}
            onChange={(e) => updateParam("from", e.target.value)}
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            defaultValue={params.get("type") || "all"}
            onChange={(e) => updateParam("type", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="profit">Profit</option>
            <option value="withdraw">Withdraw</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
