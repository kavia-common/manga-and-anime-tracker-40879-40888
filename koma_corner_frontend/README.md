# Koma Corner Frontend

A minimalist React app implementing:
- Environment-based configuration
- Supabase Auth (Google OAuth)
- AniList GraphQL integration
- React Router routes and basic pages
- React Query for data fetching
- Ocean Professional theme

## Quick Start

1. Install dependencies:
   npm install

2. Configure environment:
   - Copy `.env.example` to `.env` and fill in:
     - REACT_APP_SUPABASE_URL
     - REACT_APP_SUPABASE_ANON_KEY
     - REACT_APP_FRONTEND_URL (e.g., http://localhost:3000)
     - (Optional) REACT_APP_ANILIST_GRAPHQL_URL (defaults to https://graphql.anilist.co)
   - Existing keys are preserved and can remain empty for local dev.

3. Run the app:
   npm start

Open http://localhost:3000

## Supabase Google OAuth Setup

1) In your Supabase project:
   - Go to Authentication > URL Configuration.
   - Add the following to Redirect URLs:
     - http://localhost:3000
     - http://localhost:3000/*
     - Your deployed site origin (e.g., https://your-domain.com)
   - Add the same values to Allowed URLs if applicable.

2) In Authentication > Providers > Google:
   - Enable Google provider.
   - Provide your Google OAuth Client ID and Client Secret.
   - Set the Authorized redirect URI in Google Cloud Console to:
     - https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   - Save.

3) In this app:
   - Ensure `.env` has:
     - REACT_APP_SUPABASE_URL=https://<your-supabase-project-ref>.supabase.co
     - REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
     - REACT_APP_FRONTEND_URL=http://localhost:3000
   - Restart the dev server if it was running.

Notes:
- The OAuth `redirectTo` is set to REACT_APP_FRONTEND_URL (fallbacks to window.location.origin).
- The app listens for auth changes and persists the session via Supabase.

## Verifying Login/Logout

- Start the app: npm start
- In the top-right of the navbar:
  - Click "Login with Google". Complete the Supabase OAuth flow.
  - After redirect back, you should see your email and a "Logout" button.
- Navigate to `/protected`:
  - When logged in, you will see a protected page with your email.
  - When logged out, you will be redirected to `/`.
- The navbar shows a "Checking session..." badge during initial auth loading, and displays any auth-related errors as a red badge.

## Theme

Colors are defined in `src/theme.css`:

- primary #374151
- secondary #9CA3AF
- success #10B981
- error #EF4444
- background #FFFFFF
- surface #F9FAFB
- text #111827

## Routing

- `/` Home: Trending grid (AniList)
- `/search`: Search by title with filters (type, sort)
- `/favorites`: Placeholder
- `/progress`: Placeholder
- `/protected`: Example protected route (requires login)

## Feature Flags

- Reads REACT_APP_FEATURE_FLAGS when present (no flags used yet in this scaffold).

## Troubleshooting

- If OAuth redirects to a different domain, set REACT_APP_FRONTEND_URL to your site origin and configure Supabase Auth redirect URLs accordingly.
- Ensure `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set; the app logs a console warning if missing.
- Ensure network calls to `https://graphql.anilist.co` are allowed in your environment.
