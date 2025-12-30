"use client";
import { IDistribution } from "@/types/distribution.type";
import { format } from "date-fns";
import { Calendar, Eye, FileText } from "lucide-react";
import React, { Fragment, useState } from "react";
import { Button } from "../ui/button";
import DistributionPreviewModal from "../modal/DistributionPreviewModal";

type Props = {
  stmt: IDistribution;
};
const StatementCard = ({ stmt }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IDistribution | null>(null);
  return (
    <Fragment>
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition border">
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
              {format(new Date(stmt?.createdAt), "MMM dd, yyyy")} • Distributed
              to {stmt.members} members
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-green-600">৳ {stmt.amount}</p>
            <p className="text-xs text-muted-foreground">{stmt.status}</p>
          </div>
          <Button
            onClick={() => {
              setSelected(stmt);
              setOpen(true);
            }}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
          >
            <Eye size={16} /> View
          </Button>
        </div>
      </div>
      <DistributionPreviewModal
        open={open}
        onOpenChange={setOpen}
        data={selected}
      />
    </Fragment>
  );
};

export default StatementCard;
