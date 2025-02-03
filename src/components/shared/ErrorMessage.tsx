interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="p-4 text-red-500 bg-red-50 rounded-md">
      <p>{message}</p>
    </div>
  );
};