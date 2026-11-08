import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const requiredEnvironmentVariables = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
] as const;

function validateDatabaseUrl(value: string | undefined) {
  if (!value) {
    return { valid: false, hostname: null, reason: "DATABASE_URL is missing" };
  }

  try {
    const url = new URL(value);
    const isPostgresProtocol =
      url.protocol === "postgres:" || url.protocol === "postgresql:";
    const isNeonHost = url.hostname.endsWith(".neon.tech");
    const hasCredentials = Boolean(url.username && url.password);
    const hasDatabase = url.pathname.length > 1;
    const isPooled = url.hostname.includes("-pooler.");
    const valid =
      isPostgresProtocol &&
      isNeonHost &&
      isPooled &&
      hasCredentials &&
      hasDatabase;

    return {
      valid,
      hostname: url.hostname || null,
      reason: valid
        ? null
        : "Expected a credentialed PostgreSQL URL for a pooled Neon endpoint and database",
    };
  } catch {
    return {
      valid: false,
      hostname: null,
      reason: "DATABASE_URL is not a valid absolute URL",
    };
  }
}

const databaseUrlValidation = validateDatabaseUrl(process.env.DATABASE_URL);
if (databaseUrlValidation.valid) {
  console.info("[auth] DATABASE_URL validated", {
    hostname: databaseUrlValidation.hostname,
    pooled: true,
  });
} else if (process.env.DATABASE_URL) {
  console.error("[auth] Invalid DATABASE_URL", {
    hostname: databaseUrlValidation.hostname,
    reason: databaseUrlValidation.reason,
  });
}

export function isAuthConfigured() {
  return (
    databaseUrlValidation.valid &&
    requiredEnvironmentVariables
      .filter((name) => name !== "DATABASE_URL")
      .every((name) => Boolean(process.env[name]))
  );
}

export function getAuthConfigurationError() {
  const missing = requiredEnvironmentVariables.filter(
    (name) => !process.env[name],
  );
  if (missing.length > 0) {
    return `Authentication is not configured. Set ${missing.join(", ")}.`;
  }
  if (!databaseUrlValidation.valid) {
    return `Authentication database configuration is invalid: ${databaseUrlValidation.reason}.`;
  }
  return null;
}

export function getEnabledSocialProviders() {
  return {
    google: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
    ),
    github: Boolean(
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
    ),
  };
}

const database = isAuthConfigured()
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  : null;

const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

const github =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {};

export const auth = database
  ? betterAuth({
      appName: "BazarDor",
      database,
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET,
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        autoSignIn: false,
        minPasswordLength: 8,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },
      socialProviders: {
        ...google,
        ...github,
      },
      plugins: [nextCookies()],
    })
  : null;

export function getAuth() {
  if (!auth) {
    throw new Error(getAuthConfigurationError() ?? "Authentication is unavailable.");
  }

  return auth;
}
