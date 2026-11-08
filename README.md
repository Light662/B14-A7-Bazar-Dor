# বাজার দর (BazarDor)

BazarDor is a responsive Bengali-language market-price website for checking current prices and recent changes for everyday products across Bangladesh.

## Features

- Live product and category data from the BazarDor API, with two fallback API servers.
- Home page price movers, ticker, and product catalog.
- Category search and numeric price sorting, including Bengali digit input.
- Product market-price comparison with clearly identified derived averages.
- Better Auth email/password sign-up and sign-in, Google/GitHub OAuth when configured, and protected product details.
- Account profile and name update.
- Responsive layouts, loading skeletons, and React Hot Toast notifications.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS 4 and custom responsive design tokens
- Better Auth with Neon PostgreSQL (`pg`)
- React Hot Toast
- BazarDor public API

## Requirements

- Node.js 20.9 or later
- npm
- A Neon PostgreSQL database for authentication

## Install and configure

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   ```text
   DATABASE_URL=postgresql://...       # Neon connection string; use sslmode=require
   BETTER_AUTH_SECRET=...              # At least 32 random characters
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=                   # Optional
   GOOGLE_CLIENT_SECRET=               # Optional
   GITHUB_CLIENT_ID=                   # Optional
   GITHUB_CLIENT_SECRET=               # Optional
   ```

   Generate an auth secret with `openssl rand -base64 32`. Keep `.env` private; it is ignored by Git.

3. If enabling Google or GitHub, create OAuth applications and set their callback URLs:

   - Google: `http://localhost:3000/api/auth/callback/google`
   - GitHub: `http://localhost:3000/api/auth/callback/github`

   For production, use the deployed origin in `BETTER_AUTH_URL` and in each provider's callback URL. OAuth buttons remain unavailable until both provider credentials are configured.

4. Create Better Auth's PostgreSQL tables:

   ```bash
   npm run auth:migrate
   ```

5. Start the development server:

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

Deploy the Next.js app to Vercel. Add `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and any OAuth credentials to the Vercel project environment. Run the Better Auth migration against the production database before enabling authentication.

- Live deployment: [Add deployment URL](https://example.com)
- GitHub repository: [Add repository URL](https://github.com/)
