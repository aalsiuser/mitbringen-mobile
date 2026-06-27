# Mitbringen Mobile — Agent Guide

## Expo Docs

Always read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any Expo-related code. The API changes between SDK versions — do not rely on training data.

---

## Project Overview

**Mitbringen** is an Expo / React Native shopping-list app for iOS and Android. Users build a weekly grocery list, track savings against a monthly goal, and get store recommendations.

- **Expo SDK:** 54 (`"expo": "^54.0.35"` in package.json)
- **Router:** Expo Router v6 (file-based, typed routes enabled)
- **Styling:** NativeWind v4 + Tailwind CSS v3 (`global.css`, `tailwind.config.js`)
- **State:** Custom `AppContext` (React context + useState) + TanStack React Query for server data
- **Auth storage:** `expo-secure-store` (JWT token keyed as `auth_token`)
- **i18n:** i18next + react-i18next (`locales/` directory)
- **Error tracking:** Sentry (`@sentry/react-native`)
- **Backend API:** `https://api.mitbringen.at/api/v1` (set via `EXPO_PUBLIC_API_URL` in EAS build env)

---

## Repository Layout

```
app/
  _layout.tsx          # Root layout — fonts, i18n, splash, AppProvider, AppInitializer
  index.tsx            # Auth / onboarding router (shown when phase != 'app')
  store-rec.tsx        # Store recommendation screen
  (tabs)/
    _layout.tsx        # Bottom tab bar (protected — redirects if phase != 'app')
    index.tsx          # Home tab
    list.tsx           # Shopping list tab
    assistant.tsx      # AI assistant tab
    profile.tsx        # Profile / sign-out tab

components/
  screens/             # Full-screen components (AuthScreen, OnboardCity/Name/Goal)
  ui/                  # Reusable UI primitives (badges, marks, progress bar, etc.)

lib/
  AppContext.tsx        # Global state: phase machine, auth handlers, list/items/savings
  api.ts               # Token helpers (getToken/saveToken/clearToken) + typed API client
  auth.ts              # signIn / signUp / signOut API calls
  types.ts             # Shared TypeScript types
  i18n.ts              # i18next init
  data.ts              # Static data (product icons, etc.)

locales/               # Translation JSON files
assets/                # Images, fonts, icons
```

---

## Auth & Navigation Flow

The app uses a **phase state machine** in `AppContext` to drive navigation:

| Phase | Screen shown |
|-------|-------------|
| `auth` | `app/index.tsx` → `AuthScreen` (login / sign-up) |
| `onboard-city` | `app/index.tsx` → `OnboardCityScreen` |
| `onboard-name` | `app/index.tsx` → `OnboardNameScreen` |
| `onboard-goal` | `app/index.tsx` → `OnboardGoalScreen` |
| `app` | `app/(tabs)` — the main tab bar |

### Session resume (startup)

On mount, `AppContext` calls `getToken()` from SecureStore. If a token exists it sets `phase = 'app'` and fetches user data; if not (or 401), it stays at `phase = 'auth'`.

An `initialized: boolean` flag (starts `false`) is set to `true` in `.finally()` of that check. `AppInitializer` in `_layout.tsx` holds `null` (keeping the splash screen up) until `initialized` is `true`, then renders the navigator. **This prevents the login-screen flash on startup for authenticated users.**

---

## PR Workflow — Required for Every Issue

**Never commit directly to `main`.** For every GitHub issue:

1. Create a feature branch: `git checkout -b fix/issue-<number>-<short-description>`
2. Make changes and commit with a clear message
3. Open a PR: `gh pr create --title "..." --body "..."` — reference the issue in the body
4. Merge to `main` after review

Example branch name: `fix/issue-34-login-flash`

---

## API Client

`lib/api.ts` exports a typed fetch wrapper. Every request automatically reads the token from SecureStore and adds `Authorization: Bearer <token>`. A 401 response auto-deletes the token and throws `'UNAUTHORIZED'`, which `AppContext` catches to reset to `phase = 'auth'`.

Available API objects: `usersApi`, `listsApi`, `itemsApi`, `savingsApi`, `api` (raw).

---

## Styling Rules

- Use **NativeWind / Tailwind classes** via the `className` prop — do not use `StyleSheet.create` for new code.
- Font family is **Schibsted Grotesk** (400/500/700/800), loaded in `_layout.tsx`.
- Color palette and design tokens are in `tailwind.config.js`.

---

## EAS Builds & Submission

```
eas build --profile development   # Dev client build
eas build --profile preview       # Internal distribution
eas build --profile production    # App Store / Play Store build (auto-increments build number)
eas submit --platform ios         # Submit to TestFlight via ASC API key
```

- `appVersionSource: "remote"` — version/build numbers are managed by EAS, not locally.
- iOS bundle ID: `com.mitbringen.myapp` | EAS project ID: `8bf66ac5-788f-4966-a7e5-9269ea747678`

---

## Key Conventions

- **No comments** unless the WHY is non-obvious (hidden constraint, workaround, subtle invariant).
- **No `StyleSheet.create`** — use NativeWind classes.
- **No direct `main` commits** — always branch + PR.
- **Read Expo v56 docs** before touching anything Expo-related.
- TypeScript strict mode is on — no `any` unless unavoidable.
