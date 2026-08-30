import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "btn-touch tap-highlight font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
      ghost: "bg-transparent text-blue-600 hover:bg-blue-50 disabled:text-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
    };

    const sizeStyles = {
      sm: "h-10 px-3 text-sm",
      md: "h-12 px-4 text-base",
      lg: "h-14 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading && <span className="animate-spin">⟳</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
