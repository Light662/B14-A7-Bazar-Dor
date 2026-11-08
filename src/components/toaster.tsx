"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          border: "1px solid #e1e8e1",
          borderRadius: "10px",
          fontFamily: "var(--font-bengali), sans-serif",
        },
      }}
    />
  );
}
