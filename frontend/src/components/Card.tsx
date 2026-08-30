import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-stone-200 p-4 shadow-soft
        transition-all duration-200
        ${
          interactive
            ? "tap-highlight cursor-pointer hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lifted"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle }) => (
  <div className="mb-4">
    <h3 className="font-serif font-semibold text-lg text-stone-900">{title}</h3>
    {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="text-stone-700">{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-4 pt-4 border-t border-stone-200">{children}</div>;
