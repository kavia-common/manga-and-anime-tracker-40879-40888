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
     - (Optional) REACT_APP_ANILIST_GRAPHQL_URL (defaults to https://graphql.anilist.co)
   - Existing keys are preserved and can remain empty for local dev.

3. Run the app:
   npm start

Open http://localhost:3000

## Auth Notes

- The Login with Google button uses Supabase OAuth. Actual sign-in requires valid REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
- emailRedirectTo/redirectTo uses REACT_APP_FRONTEND_URL if available (fallbacks to window.location.origin).

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

## Feature Flags

- Reads REACT_APP_FEATURE_FLAGS when present (no flags used yet in this scaffold).

## Troubleshooting

- If OAuth redirects to a different domain, set REACT_APP_FRONTEND_URL to your site origin and configure Supabase Auth redirect URLs accordingly.
- Ensure network calls to `https://graphql.anilist.co` are allowed in your environment.
