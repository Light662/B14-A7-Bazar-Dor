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
        <svg
          aria-hidden="true"
          className="social-provider-icon"
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.75 3.28-8.09Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.15a11 11 0 0 0 0 9.88l3.69-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.85 6.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
          />
        </svg>
        Google দিয়ে চালিয়ে যান
      </button>
      <button
        aria-disabled={!githubEnabled || !authReady}
        className="social-login-button"
        onClick={() => signIn("github", githubEnabled)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="social-provider-icon"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.15c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.17 1.19a11 11 0 0 1 5.78 0c2.2-1.5 3.16-1.19 3.16-1.19.63 1.6.23 2.78.12 3.07.74.81 1.18 1.85 1.18 3.11 0 4.43-2.69 5.4-5.26 5.69.42.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
          />
        </svg>
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
