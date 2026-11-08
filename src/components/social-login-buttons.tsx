"use client";

import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function SocialLoginButtons({
  googleEnabled,
  githubEnabled,
  authReady,
  callbackURL,
}: {
  googleEnabled: boolean;
  githubEnabled: boolean;
  authReady: boolean;
  callbackURL: string;
}) {
  async function signIn(provider: "google" | "github", enabled: boolean) {
    if (!authReady) {
      toast.error("সোশ্যাল সাইন ইন চালু করতে ডাটাবেস সেটআপ প্রয়োজন।");
      return;
    }
    if (!enabled) {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} sign-in সেটআপ করা নেই।`,
      );
      return;
    }

    try {
      const result = await authClient.signIn.social({ provider, callbackURL });
      if (result.error) {
        toast.error(result.error.message || "সোশ্যাল সাইন ইন করা যায়নি।");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "সোশ্যাল সাইন ইন করা যায়নি।",
      );
    }
  }

  return (
    <div className="social-login-row">
      <button
        aria-disabled={!googleEnabled || !authReady}
        className="social-login-button"
        onClick={() => signIn("google", googleEnabled)}
        type="button"
      >
        <span aria-hidden="true" className="google-mark">
          G
        </span>
        Google দিয়ে চালিয়ে যান
      </button>
      <button
        aria-disabled={!githubEnabled || !authReady}
        className="social-login-button"
        onClick={() => signIn("github", githubEnabled)}
        type="button"
      >
        <span aria-hidden="true" className="github-mark">
          ◉
        </span>
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
