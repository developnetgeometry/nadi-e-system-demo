import React, { useRef } from "react";

interface ICBoxInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onBlurEnd?: () => void; // 🔹 New optional prop
}

export function ICBoxInput({
  value,
  onChange,
  disabled = false,
  onBlurEnd,
}: ICBoxInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return; // Only allow digits
    const chars = value.split("");
    chars[index] = char;
    const newValue = chars.map((c, i) => c || "").join("").slice(0, 12);
    onChange(newValue);

    // Auto focus next
    if (char && index < 11) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const chars = value.split("");
      chars[index - 1] = "";
      onChange(chars.join(""));
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          //onBlur={i === 11 ? onBlurEnd : undefined} // 🔹 Only attach onBlur to last input
          onBlur={onBlurEnd} // 🔹 Only attach onBlur to last input
          disabled={disabled}
          className="w-8 h-10 text-center border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
