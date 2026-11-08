import { SignUpForm } from "@/components/sign-up-form";
import { getEnabledSocialProviders, isAuthConfigured } from "@/lib/auth";

export default function SignUpPage() {
  const socialProviders = getEnabledSocialProviders();

  return (
    <SignUpForm
      authReady={isAuthConfigured()}
      githubEnabled={socialProviders.github}
      googleEnabled={socialProviders.google}
    />
  );
}
