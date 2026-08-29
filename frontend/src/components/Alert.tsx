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
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={`
        border-l-4 p-4 rounded-lg
        ${typeStyles[type]}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 font-bold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
