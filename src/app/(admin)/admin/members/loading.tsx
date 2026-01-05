import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// Members Loading Skeleton - Admin
const MembersLoading = () => {
  return (
    <div className="p-6 md:p-8 space-y-6 ">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Search & Filter Skeleton */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>

          <div className="flex items-end">
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </Card>

      {/* Table Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 border-b pb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-7 gap-4 items-center py-3 border-b"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24 ml-auto" />
            <Skeleton className="h-6 w-20 mx-auto rounded-full" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default MembersLoading;
