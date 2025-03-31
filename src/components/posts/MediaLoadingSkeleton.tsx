import { Skeleton } from "../ui/skeleton";

export default function UserMediaLoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <MediaLoadingSkeleton />
      <MediaLoadingSkeleton />
      <MediaLoadingSkeleton />
      <MediaLoadingSkeleton />
      <MediaLoadingSkeleton />
      <MediaLoadingSkeleton />
    </div>
  );
}

function MediaLoadingSkeleton() {
  return <Skeleton className="aspect-square w-full rounded-sm" />;
}
