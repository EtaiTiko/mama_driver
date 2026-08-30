import React from "react";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  children,
  onClose,
}) => {
  const typeStyles = {
    success: "bg-success-50 text-success-700 border-success-500",
    error: "bg-danger-50 text-danger-700 border-danger-500",
    warning: "bg-warning-50 text-warning-700 border-warning-500",
    info: "bg-primary-50 text-primary-700 border-primary-500",
  };

  return (
    <div
      className={`
        border-r-4 p-4 rounded-xl
        ${typeStyles[type]}
      `}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="font-bold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
