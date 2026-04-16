import { Skeleton } from "@/components/ui/skeleton";

type SectionSkeletonProps = {
  type: "card" | "table-row" | "hero";
  count?: number;
};

export default function SectionSkeleton({ type, count = 3 }: SectionSkeletonProps) {
  if (type === "hero") {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-11/12" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  if (type === "table-row") {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="grid grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((__, cellIndex) => (
              <Skeleton key={cellIndex} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-saffron/20 bg-charcoal/70 p-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
