import { ErrorFallbackProps } from "@/types/dashboard";

export const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  return (
    <div className="p-4 text-red-500">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
};