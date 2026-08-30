import React from "react";

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "טוען...",
}) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
      <div className="animate-spin text-3xl text-primary-600">⟳</div>
    </div>
    <p className="text-stone-500">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
}> = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center">
    <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-4xl mb-4">
      {icon}
    </div>
    <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-500">{message}</p>
  </div>
);
