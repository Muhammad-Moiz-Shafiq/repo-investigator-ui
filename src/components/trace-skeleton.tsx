import { Skeleton } from "@/components/ui/skeleton";

export function TraceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-l-2 border-l-muted py-3 pl-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-3 h-14 w-full" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-6">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </div>
      <p className="text-xs text-muted-foreground">
        Investigating — this runs a real multi-step agent and can take up to a few minutes.
      </p>
    </div>
  );
}
