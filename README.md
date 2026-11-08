# বাজার দর (BazarDor)

BazarDor is a responsive Bengali-language market-price website for checking current prices and recent changes for everyday products across Bangladesh.

## Features

- Live product and category data from the BazarDor API, with two fallback API servers.
- Home page price movers, ticker, and product catalog.
- Category search and numeric price sorting, including Bengali digit input.
- Product market-price comparison with clearly identified derived averages.
- Self-hosted Better Auth email/password and optional Google/GitHub sign-in, with protected product details.
- Account profile and name update.
- Responsive layouts, loading skeletons, and React Hot Toast notifications.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS 4 and custom responsive design tokens
- Better Auth with Neon PostgreSQL
- React Hot Toast
- BazarDor public API

## Requirements

- Node.js 20.9 or later
- npm
- Access to the existing Neon PostgreSQL production branch

## Install and configure

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and configure the existing Neon PostgreSQL connection:

   - Use the pooled Neon connection URL for app traffic.
   - Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.
   - Set `BETTER_AUTH_URL` to the app origin, such as `http://localhost:3000`.
   - Google and GitHub buttons are enabled only when both credentials for that provider are set.
   - Set each OAuth app's callback URL to `{BETTER_AUTH_URL}/api/auth/callback/google` or `{BETTER_AUTH_URL}/api/auth/callback/github`.

3. Ensure Better Auth's PostgreSQL schema exists in the `public` schema:

   ```bash
   npx auth@latest migrate
   ```

   This app uses Better Auth's standard `user`, `session`, `account`, and `verification` tables. The existing Neon `neon_auth` schema is not used or modified. Keep `.env.local` private; it is ignored by Git.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Deploy the Next.js app to Vercel and set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in the Production environment. Add Google and GitHub credentials there to enable those providers. Configure each OAuth app with the matching Vercel callback URL. The app uses self-hosted Better Auth; existing Neon Managed Auth data is left untouched and is not imported automatically.

- Live deployment: https://bazar-dor-flame-one.vercel.app/
- GitHub repository: https://github.com/Light662/B14-A7-Bazar-Dor
