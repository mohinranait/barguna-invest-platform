import React from "react";
import UserContainer from "@/components/shared/UserContainer";
import UserHeader from "@/components/shared/UserHeader";

import TransactionFilters from "@/components/pages/user/transaction/TransactionFilter";
import TransactionTable from "@/components/pages/user/transaction/TransactionTable";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/transaction.model";
import { ITransaction } from "@/types/transaction.type";
import { isAuth } from "@/lib/helpers";

interface PageProps {
  searchParams: {
    search?: string;
    type?: string;
    from?: string;
    to?: string;
    userId?: string;
  };
}

export default async function InvestmentsPage({ searchParams }: PageProps) {
  await connectDB();
  const { search, type, from, to, userId } = searchParams;
  const authUser = await isAuth();

  const filter: {
    type?: string;
    amount?: number;
    search?: string;
    createdAt?: { $gte?: Date; $lte?: Date };
    ownerBy?: string;
  } = {
    ownerBy: userId ? userId : authUser?.userId,
  };

  /* ===== Type ===== */
  if (type && type !== "all") {
    filter.type = type;
  }

  /* ===== Search by amount ===== */
  if (search) {
    const amount = Number(search);
    if (!isNaN(amount)) {
      filter.amount = amount;
    }
  }

  /* ===== Date range ===== */
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const historys: ITransaction[] = JSON.parse(JSON.stringify(transactions));

  return (
    <UserContainer className="pt-4">
      <UserHeader />

      <div className="space-y-6 pt-4">
        <div>
          <h1 className="text-3xl font-bold">Investment & Profit History</h1>
          <p className="text-muted-foreground mt-1">
            View all your investments and profits
          </p>
        </div>

        {/* Filters */}
        <TransactionFilters />

        {/* Table */}
        <TransactionTable historys={historys} />
      </div>
    </UserContainer>
  );
}
