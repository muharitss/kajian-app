import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ArticleSkeleton: React.FC = () => {
  return (
    <Card className="h-full overflow-hidden flex flex-col justify-between">
      <div>
        <Skeleton className="aspect-video w-full" />
        <CardHeader className="space-y-2 pb-2">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-2/3" />
        </CardHeader>
        <CardContent className="pb-2 space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </div>
      <CardFooter className="pt-3 border-t flex justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </CardFooter>
    </Card>
  );
};
