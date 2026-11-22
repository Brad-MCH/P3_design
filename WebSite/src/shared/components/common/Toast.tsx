import React from "react";

export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 right-5 z-50 bg-cacao-950 text-crema-fondo px-4 py-2.5 rounded-full shadow-lg text-xs sm:text-sm font-medium"
    >
      {message}
    </div>
  );
};
