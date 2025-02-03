import { ErrorFallbackProps } from "@/types/dashboard";

/**
 * A fallback component that displays error information when an error boundary catches an error
 * @param error - The error object containing the error message
 */
export const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  console.error("ErrorFallback rendered with error:", error);
  
  return (
    <div className="p-6 mx-auto max-w-2xl bg-red-50 rounded-lg border border-red-100">
      <h2 className="text-lg font-semibold text-red-700 mb-2">Something went wrong:</h2>
      <pre className="text-sm text-red-600 whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
};