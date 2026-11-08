import { NextRequest, NextResponse } from "next/server";
import { getAuth, isAuthConfigured } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.next();
  }

  const session = await getAuth().api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("reason", "auth_required");
    signInUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/product/:path*"],
};
