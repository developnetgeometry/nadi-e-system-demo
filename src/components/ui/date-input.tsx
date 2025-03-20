import * as React from "react";
import { cn } from "@/lib/utils";

const DateInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, placeholder, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className="relative">
        <input
          type="date"
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0",
            className
          )}
          ref={inputRef}
          {...props}
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={() => inputRef.current?.showPicker()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
