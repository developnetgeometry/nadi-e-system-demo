import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react"; // Import the X icon

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  showClearButton?: boolean; // Optional prop to control visibility of clear button
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, showClearButton = true, value, onChange, ...props }, ref) => {
    // Function to handle clearing the input
    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Create a proper synthetic event to ensure full clearing of the date
      const inputElement = document.createElement('input');
      inputElement.type = 'date';
      inputElement.name = props.name || '';
      inputElement.value = '';
      
      const syntheticEvent = {
        target: inputElement,
        currentTarget: inputElement,
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        preventDefault: () => {},
        stopPropagation: () => {},
        nativeEvent: e.nativeEvent,
        type: 'change'
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      if (onChange) {
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <input
          type="date"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            // Add padding-right to accommodate the clear button
            showClearButton && value ? "pr-8" : "",
            // Fix calendar icon positioning 
            "[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showClearButton && value && (
          <button
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 mr-1 hover:text-muted-foreground cursor-pointer"
            type="button"
            aria-label="Clear date"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
