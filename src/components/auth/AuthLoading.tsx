
import { Loader2 } from "lucide-react";

/**
 * A specialized loading component for authentication and permissions checks
 * Displays a more informative message while security checks are performed
 */
export const AuthLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh] p-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h3 className="text-xl font-medium mb-2">Verifying Access</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Please wait while we verify your permissions and access rights...
      </p>
    </div>
  );
};
