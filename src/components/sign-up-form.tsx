"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { SocialLoginButtons } from "@/components/social-login-buttons";

export function SignUpForm({
  databaseReady,
  googleEnabled,
  githubEnabled,
}: {
  databaseReady: boolean;
  googleEnabled: boolean;
  githubEnabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("নাম ও সঠিক ইমেইলসহ সব তথ্য পূরণ করুন।");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/signin?registered=1",
      });

      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      router.push("/signin?registered=1");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "অ্যাকাউন্ট তৈরি করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page content-width">
      <div className="auth-column">
        <div className="auth-heading">
          <h1>অ্যাকাউন্ট তৈরি করুন</h1>
          <p>বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
        </div>
        <div className="surface-card auth-card">
          <form className="auth-form" noValidate onSubmit={submit}>
            <label className="form-field">
              <span>নাম</span>
              <input autoComplete="name" name="name" placeholder="যেমন: রহিম উদ্দিন" required />
            </label>
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
                autoComplete="new-password"
                minLength={8}
                name="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                type="password"
              />
            </label>
            {!databaseReady && (
              <p className="form-note">
                অ্যাকাউন্ট তৈরি করতে .env ফাইলে ডাটাবেস, অথেন্টিকেশন সিক্রেট ও বেস URL সেট করুন।
              </p>
            )}
            <button className="button button-primary button-full" disabled={loading || !databaseReady} type="submit">
              {loading ? "অপেক্ষা করুন…" : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
            <div className="divider"><span>অথবা</span></div>
            <SocialLoginButtons
              authReady={databaseReady}
              callbackURL="/"
              githubEnabled={githubEnabled}
              googleEnabled={googleEnabled}
            />
            <p className="auth-switch">
              অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link>
            </p>
          </form>
        </div>
        <Link className="back-home" href="/">← হোম পেজে ফিরে যান</Link>
      </div>
    </section>
  );
}
