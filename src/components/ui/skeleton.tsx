import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gray-200", className)}
      {...props}
    />
  );
}

function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-11 w-11 rounded-lg" />
      </div>
    </div>
  );
}

function LessonListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="bg-gray-50 px-4 py-3 flex gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-gray-100 px-4 py-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, CourseCardSkeleton, StatsCardSkeleton, LessonListSkeleton, TableSkeleton };
