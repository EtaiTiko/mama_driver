import React from "react";

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "טוען...",
}) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin text-4xl mb-4">⟳</div>
    <p className="text-gray-600">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
}> = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{message}</p>
  </div>
);
