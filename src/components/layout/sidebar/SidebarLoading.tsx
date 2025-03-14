
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const SidebarLoading = () => {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-8 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-5/6 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-6 w-4/5 rounded-md" />
      </div>
    </div>
  );
};
