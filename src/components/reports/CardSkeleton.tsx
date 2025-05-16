import React, { useEffect, useState } from "react";

type CardSkeletonProps = {
  height?: number;
  delay?: number; // Delay before showing the spinner to avoid flickering
};

export const CardSkeleton = ({ height = 120, delay = 300 }: CardSkeletonProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  
  // Only show the spinner after a delay to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
    return (
    <div className="flex items-center justify-center p-4" style={{ height }}>
      {showSpinner ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      ) : (
        // Empty space holder to maintain layout during loading state
        <div className="h-8 w-8"></div>
      )}
    </div>
  );
};
