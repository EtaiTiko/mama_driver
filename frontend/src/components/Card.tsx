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
        surface p-5
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
  <div className="mb-5 flex items-start justify-between gap-4">
    <div>
      <h3 className="font-serif font-semibold text-xl text-stone-950">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
    </div>
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="text-stone-700">{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-4 pt-4 border-t border-stone-200">{children}</div>;
