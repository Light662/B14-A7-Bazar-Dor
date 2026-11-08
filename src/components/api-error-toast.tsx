"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export function ApiErrorToast({ message }: { message: string }) {
  useEffect(() => {
    toast.error(message, { id: "market-data-error" });
  }, [message]);

  return null;
}
