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
      "btn-touch tap-highlight font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-brand text-white shadow-soft hover:shadow-lifted hover:brightness-110 disabled:bg-none disabled:bg-stone-300 disabled:shadow-none disabled:brightness-100",
      secondary:
        "bg-stone-100 text-stone-900 hover:bg-stone-200 disabled:bg-stone-50 disabled:text-stone-400",
      ghost:
        "bg-transparent text-primary-600 hover:bg-primary-50 disabled:text-stone-400",
      danger:
        "bg-danger-500 text-white shadow-soft hover:bg-danger-600 disabled:bg-stone-300 disabled:shadow-none",
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
