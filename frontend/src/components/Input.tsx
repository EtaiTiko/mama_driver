import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, fullWidth = true, className, ...props },
    ref
  ) => {
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            input-touch border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? "border-red-500" : ""}
            ${fullWidth ? "w-full" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && (
          <p className="text-gray-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
