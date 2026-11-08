import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth, isAuthConfigured } from "@/lib/auth";

export async function getSession() {
  if (!isAuthConfigured()) {
    return null;
  }

  return getAuth().api.getSession({ headers: await headers() });
}

export async function requireSession(returnTo: string) {
  const session = await getSession();

  if (!session) {
    redirect(`/signin?reason=auth_required&next=${encodeURIComponent(returnTo)}`);
  }

  return session;
}
