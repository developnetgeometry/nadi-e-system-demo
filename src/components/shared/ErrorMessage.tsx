interface ErrorMessageProps {
  message: string;
}

/**
 * A reusable error message component for displaying error states
 * @param message - The error message to display
 */
export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  console.error("ErrorMessage displayed:", message);
  
  return (
    <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-lg">
      <p className="flex items-center">
        <span className="mr-2">⚠️</span>
        {message}
      </p>
    </div>
  );
};