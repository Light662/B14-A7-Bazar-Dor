import { getAuth, getAuthConfigurationError } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

type AuthHandlers = ReturnType<typeof toNextJsHandler>;
let handlers: AuthHandlers | undefined;

function configurationError() {
  const message = getAuthConfigurationError();
  if (!message) {
    return null;
  }

  return Response.json(
    { message },
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
