import React from "react";

type CardSkeletonProps = {
  height?: number;
};

export const CardSkeleton = ({ height = 120 }: CardSkeletonProps) => {
  return (
    <div className="flex items-center justify-center p-4" style={{ height }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};
