import { Loader2 } from "lucide-react";

/**
 * A reusable loading spinner component that indicates content is being loaded
 */
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Loading...</span>
    </div>
  );
};