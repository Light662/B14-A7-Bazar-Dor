"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfileUpdateForm({ name }: { name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedName = String(formData.get("name") ?? "").trim();

    if (!updatedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.updateUser({ name: updatedName });
      if (result.error) {
        toast.error(result.error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }
      toast.success("আপনার তথ্য আপডেট হয়েছে।");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "তথ্য আপডেট করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="profile-update-form" noValidate onSubmit={submit}>
      <label className="form-field">
        <span>নাম</span>
        <input autoComplete="name" defaultValue={name} name="name" required />
      </label>
      <button className="button button-primary" disabled={loading} type="submit">
        {loading ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
      </button>
    </form>
  );
}
