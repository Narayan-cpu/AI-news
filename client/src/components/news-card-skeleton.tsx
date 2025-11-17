import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Skeleton className="aspect-video w-full" />
      
      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>

        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />

        <div className="flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
