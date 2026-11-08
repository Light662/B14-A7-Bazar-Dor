import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

type AuthHandlers = ReturnType<typeof toNextJsHandler>;
let handlers: AuthHandlers | undefined;

function configurationError() {
  const missing = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ].filter((key) => !process.env[key]);

  if (missing.length === 0) {
    return null;
  }

  return Response.json(
    {
      message: `Authentication is not configured. Set ${missing.join(", ")}.`,
    },
    { status: 503 },
  );
}

function getHandlers() {
  handlers ??= toNextJsHandler(getAuth());
  return handlers;
}

export async function GET(request: Request) {
  const error = configurationError();
  return error ?? getHandlers().GET(request);
}

export async function POST(request: Request) {
  const error = configurationError();
  return error ?? getHandlers().POST(request);
}
