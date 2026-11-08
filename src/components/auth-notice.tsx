"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export function AuthNotice({
  reason,
  registered,
}: {
  reason?: string;
  registered?: boolean;
}) {
  useEffect(() => {
    if (reason === "auth_required") {
      toast.error("এই পৃষ্ঠাটি দেখতে আগে সাইন ইন করুন।", {
        id: "auth-required",
      });
    }
    if (registered) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।", {
        id: "registration-success",
      });
    }
  }, [reason, registered]);

  return null;
}
