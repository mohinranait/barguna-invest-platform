import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function DepositVerificationLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Deposit Cards */}
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              {/* Amount + Status */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Details */}
              <div className="grid gap-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-44" />
              </div>

              {/* Action Button */}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DepositVerificationLoading;
