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
        bg-white rounded-lg border border-gray-200 p-4
        ${interactive ? "tap-highlight cursor-pointer" : ""}
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
    <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="text-gray-700">{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-4 pt-4 border-t border-gray-200">{children}</div>;
