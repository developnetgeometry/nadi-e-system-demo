import React, { InputHTMLAttributes, forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, Calendar } from "lucide-react"; // Import both X and Calendar icons

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  showClearButton?: boolean; // Optional prop to control visibility of clear button
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, showClearButton = true, value, onChange, onClick, ...props }, ref) => {
    // Create an internal ref if no ref is provided
    const inputRef = useRef<HTMLInputElement | null>(null);
    const resolvedRef = (ref || inputRef) as React.MutableRefObject<HTMLInputElement | null>;
    
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
    
    // Function to handle clicking on the input or button
    const handleInputClick = (e: React.MouseEvent<HTMLElement>) => {
      // Open the native date picker by simulating a click on the calendar icon
      if (resolvedRef.current) {
        // This triggers the native date picker to open
        resolvedRef.current.showPicker();
      }
      
      // Call the original onClick if it exists
      if (onClick && e.target instanceof HTMLInputElement) {
        onClick(e as React.MouseEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="relative group">
        <input
          type="date"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-400 transition-colors cursor-pointer",
            // Add padding-right to accommodate the clear button and calendar icon
            showClearButton && value ? "pr-16" : "pr-10",
            // Hide the native calendar picker icon
            "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:hidden",
            className
          )}
          ref={resolvedRef}
          value={value}
          onChange={onChange}
          onClick={handleInputClick}
          {...props}
        />
        {/* Calendar Icon Button */}
        <button
          type="button"
          onClick={handleInputClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          aria-label="Open calendar"
        >
          <Calendar size={16} />
        </button>
        
        {showClearButton && value && (
          <button
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 mr-1 hover:text-foreground cursor-pointer transition-colors"
            type="button"
            aria-label="Clear date"
          >
            <X className="text-muted-foreground" size={16} />
          </button>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
