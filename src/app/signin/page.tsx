import { SignInForm } from "@/components/sign-in-form";
import { isAuthConfigured } from "@/lib/auth";

function getSafeNextPath(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(
    typeof params.next === "string" ? params.next : undefined,
  );

  return (
    <SignInForm
      databaseReady={isAuthConfigured()}
      githubEnabled={Boolean(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
      )}
      googleEnabled={Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      )}
      nextPath={nextPath}
      reason={typeof params.reason === "string" ? params.reason : undefined}
      registered={params.registered === "1"}
    />
  );
}
