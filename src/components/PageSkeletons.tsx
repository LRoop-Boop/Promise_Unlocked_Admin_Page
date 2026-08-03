import { Skeleton, ChartSkeleton, TableRowsSkeleton } from "./Skeleton";

export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ))}
      </div>
      <ChartSkeleton />
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <Skeleton className="h-4 w-40" />
        <TableRowsSkeleton rows={6} />
      </div>
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <ChartSkeleton height="h-72" />
      <ChartSkeleton height="h-72" />
    </div>
  );
}

export function CandidatesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white shadow p-4 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaxonomySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="rounded-md border overflow-hidden p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CandidateProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-56 w-56 rounded-full mx-auto" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <Skeleton className="h-5 w-40" />
        <TableRowsSkeleton rows={3} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <Skeleton className="h-5 w-32" />
        <TableRowsSkeleton rows={4} />
      </div>
    </div>
  );
}