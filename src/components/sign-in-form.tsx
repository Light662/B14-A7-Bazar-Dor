"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { AuthNotice } from "@/components/auth-notice";
import { SocialLoginButtons } from "@/components/social-login-buttons";

export function SignInForm({
  nextPath,
  reason,
  registered,
  authReady,
  googleEnabled,
  githubEnabled,
}: {
  nextPath: string;
  reason?: string;
  registered?: boolean;
  authReady: boolean;
  googleEnabled: boolean;
  githubEnabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("সঠিক ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: nextPath,
      });

      if (result.error) {
        toast.error(result.error.message || "সাইন ইন করা যায়নি।");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে।");
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন ইন করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthNotice reason={reason} registered={registered} />
      <section className="auth-page content-width">
        <div className="auth-column">
          <div className="auth-heading">
            <h1>সাইন ইন</h1>
            <p>বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে প্রবেশ করুন।</p>
          </div>
          <div className="surface-card auth-card">
            <form className="auth-form" noValidate onSubmit={submit}>
              <label className="form-field">
                <span>ইমেইল</span>
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="আপনার ইমেইল"
                  required
                  type="email"
                />
              </label>
              <label className="form-field">
                <span>পাসওয়ার্ড</span>
                <input
                  autoComplete="current-password"
                  name="password"
                  placeholder="আপনার পাসওয়ার্ড"
                  required
                  type="password"
                />
              </label>
              {!authReady && (
                <p className="form-note">
                  সাইন ইন চালু করতে সার্ভারের authentication environment কনফিগারেশন সম্পূর্ণ করুন।
                </p>
              )}
              <button
                className="button button-primary button-full"
                disabled={loading || !authReady}
                type="submit"
              >
                {loading ? "অপেক্ষা করুন…" : "সাইন ইন"}
              </button>
              <div className="divider"><span>অথবা</span></div>
              <SocialLoginButtons
                authReady={authReady}
                callbackURL={nextPath}
                githubEnabled={githubEnabled}
                googleEnabled={googleEnabled}
              />
              <p className="auth-switch">
                অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link>
              </p>
            </form>
          </div>
          <Link className="back-home" href="/">← হোম পেজে ফিরে যান</Link>
        </div>
      </section>
    </>
  );
}
