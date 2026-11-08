import { SignUpForm } from "@/components/sign-up-form";
import { isAuthConfigured } from "@/lib/auth";

export default function SignUpPage() {
  return (
    <SignUpForm
      databaseReady={isAuthConfigured()}
      githubEnabled={Boolean(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
      )}
      googleEnabled={Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      )}
    />
  );
}
