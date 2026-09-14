import React from "react";

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => (
  <hr className={`border-stone-200 my-4 ${className}`} />
);

interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Spacer: React.FC<SpacerProps> = ({ size = "md" }) => {
  const sizeClass = {
    xs: "h-2",
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-12",
  }[size];

  return <div className={sizeClass} />;
};

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={`page-wrap ${className ?? ""}`}>{children}</div>;
