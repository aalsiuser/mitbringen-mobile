# Handoff: mitbringen App — Full UI (v3)

## Overview
**mitbringen** is a grocery savings app. It finds the cheapest current prices across Hofer, Lidl, Spar and Billa, lets users build a shopping list, recommends where to shop, and tracks cumulative savings. This handoff covers the complete current UI: **Auth**, **Home**, **Lists** (list builder + store recommendation), **Profile**, and **Assistant**.

## What changed in v3 (vs v2)
- **Deals tab replaced with Assistant tab** — a "coming soon" teaser screen with chat preview, blurred locked response, 3 capability cards, and a "Notify me when it's ready" CTA.
- **All "Vienna" references removed** from user-facing copy.
- Auth, Profile, and sign-out flow unchanged from v2.

## About the Design Files
The files in `src/` are **high-fidelity design references built in React + Babel** — not production code. Recreate them in the target codebase using its framework and patterns. Drop the SVGs from `assets/brand/` in directly — those are production-ready.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions. Pixel-close recreation expected.

---

## App Shell
400 × 858 px phone frame, centered on a gradient backdrop, letterboxes to 100dvh below 460 px.
```
.app (flex column, border-radius 42px)
├── TopBar   (flex 0, ~70px) — hidden during StoreRec and Assistant
├── Screen   (flex 1, overflow-y auto)
└── TabBar   (flex 0, ~80px) — always visible except during StoreRec
```
Global nav: `authed` (bool) · `tab` (home|list|assistant|profile) · `view` (build|store)

---

## Screens

### 1 — Auth
- Default entry screen (`authed === false`), no TopBar/TabBar.
- Two modes: **login** ("Welcome back") and **signup** ("Save on every shop").
- Google one-tap → `onAuth()`. Email+password with inline validation (email regex, pw ≥ 6).
- Toggle link switches modes. "Forgot password?" shown in login mode only.
- On success: `authed = true` → Home.

### 2 — Home (`tab === "home"`)
- TopBar: Brand icon + greeting "Guten Morgen, [firstName]" + search button + avatar (taps to Profile).
- Blue gradient savings card: animated total · progress track · goal meta.
- Quick-action grid (4): New list, Scan bill (stub), Deals, Goal (stub).
- List summary card → opens Lists tab.
- "Where to save this week" store rows (up to 3, sorted by savings).

### 3a — List Builder (`tab === "list"`, `view === "build"`)
- Search bar with autocomplete dropdown (up to 6 results, filters catalog).
- Item rows with emoji, store colour dot, promo/was prices, trash button.
- Empty state when list is empty.
- Sticky footer (when ≥1 item): savings summary + "Find where to shop" CTA → `view = "store"`.

### 3b — Store Recommendation (`view === "store"`)
- Full-screen, no TopBar. Own back button.
- Blue savings card: "Most you can save €X".
- Expandable store cards sorted by saving; best choice gets blue banner.
- "I shopped — bank €X" dark CTA → completes trip: saves amount, clears list, toast, returns to Home.

### 4 — Profile (`tab === "profile"`)
- TopBar shows "Profile" title, no avatar.
- Header card: 80px avatar (blue gradient, initial), name, email, green savings pill.
- Account card: Name row + Email row → each opens EditSheet (bottom sheet, auto-focus input, validation).
- Sign out button (coral) → ConfirmSheet → `authed = false` → Auth screen.
- Name changes propagate to avatar initial + home greeting.

### 5 — Assistant (`tab === "assistant"`)
- No TopBar. Screen manages its own header.
- **Grabber pill** at top (36×4 px, line2 colour).
- **Header:** 42×42 green-soft icon tile (chat icon) + "Assistant" + "COMING SOON" amber pill + × close → Home.
- **Teaser chat:** green right-aligned bubble ("Where can I find oat milk on offer near me?") + blurred white reply bubble with dark "Unlocks soon" pill overlay.
- **3 capability cards** (white, rounded, gap 9):
  - Find anything — "Where's gluten-free pasta near me?"
  - Smarter swaps — "Cheaper alternatives for what's on your list"
  - Learns your taste — "Suggests foods you'll love, from your shops"
- **CTA:** "Notify me when it's ready" (dark .btn) → toggles to "We'll let you know" + check icon (one-time, no-op).

---

## Interactions & Behaviour
| Trigger | Behaviour |
|---|---|
| Google / valid email+pw | `authed = true` → Home |
| Sign out confirm | `authed = false` → Auth |
| Tab tap | Navigate; resets view to "build" |
| Avatar tap (Home) | Navigate to Profile |
| × on Assistant | Navigate to Home |
| Add item | Prepend to list (no duplicates) |
| Complete shop | `saved += amount`, list clears, toast 2.8s, tab → Home |
| Edit name/email | Bottom sheet → saves to `profile` state app-wide |
| Notify (Assistant) | Button state toggles once |

---

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#e9edf4` | App background |
| `--surface` | `#ffffff` | Cards, inputs |
| `--inset` | `#f4f6fa` | Fields, icon bg |
| `--ink` | `#0d1220` | Primary text |
| `--ink2` | `#586172` | Secondary text |
| `--ink3` | `#9aa3b2` | Labels |
| `--line` | `#eef1f6` | Hairlines |
| `--line2` | `#e3e8ef` | Input borders |
| `--blue` | `#2461ff` | CTA, tab active |
| `--blue-deep` | `#1748d8` | Tile gradient end |
| `--blue-soft` | `#eaf0ff` | Focus rings, tint |
| `--green` | `#12a150` | Savings, success |
| `--green-soft` | `#e6f5ec` | Green tint bg |
| `--green-tint` | `#f1f9f4` | Assistant icon bg |
| `--coral` | `#ff6a4d` | Sign out, errors |
| `--coral-soft` | `#fff0ec` | Coral tint bg |
| `--amber` | `#f5a623` | COMING SOON text |
| `--amber-soft` | `#fef3c7` | COMING SOON bg |
| Blue tile | `linear-gradient(150deg,#2f6bff,#1748d8)` | Icon, avatar, savings card |
| Check Green | `#2fc46f` | Logo check badge |
| Fresh Lime | `#c4ec5a` | Logo leaf |

### Shadows
```
--shadow:       0 1px 2px rgba(13,18,32,.04), 0 8px 22px rgba(13,18,32,.06)
--shadow-card:  0 2px 6px rgba(13,18,32,.05), 0 16px 34px -12px rgba(13,18,32,.12)
--shadow-blue:  0 14px 30px -10px rgba(36,97,255,.5)
```

### Typography
- **Font:** Schibsted Grotesk (Google Fonts), weights 400–900
- **Wordmark:** `mit` (ink) + `bringen` (`#2461ff`), weight 800, tracking `-0.045em`
- **Headlines:** weight 800, tracking `-0.03em` to `-0.045em`
- **Currency:** `font-variant-numeric: tabular-nums` everywhere

### Geometry
| Element | Radius |
|---|---|
| App frame | 42px |
| Cards | 22px |
| Inputs | 14–15px |
| Icon tiles | 24% of size |
| Bottom sheets | 28px top corners |
| Avatar | 50% |

---

## State
```
authed:     bool          // false on boot → Auth screen
tab:        home|list|assistant|profile
view:       build|store   // sub-state within list tab
items:      Product[]     // list (seeds with 7 items)
saved:      number        // cumulative savings (starts 23.40)
goal:       number        // monthly target (50.00)
profile:    {name, email} // persists across sign-out
editing:    FieldConfig|null
confirmOut: bool
```

---

## Assets (`assets/brand/`)
| File | Use |
|---|---|
| `icon-app.svg` | App icon, favicon, splash |
| `mark-color.svg` | Full-colour mark on dark/blue bg |
| `mark-mono-blue.svg` | Single-colour blue on light bg |
| `mark-mono-white.svg` | Single-colour white on dark bg |

Render `icon-app.svg` to PNG at 16/32/48/180/192/512 px for favicon set.

---

## Source Files (`src/`)
| File | Contents |
|---|---|
| `mitbringen.html` | Shell: CSS tokens + keyframes + script tags |
| `gapp.jsx` | All React components: Icon · Brand · Auth · GoogleG · Home · ListBuilder · StoreRec · AssistantScreen · Profile · EditSheet · ConfirmSheet · App |
| `data.jsx` | CATALOG · STORES · savingsOf · optimiseBasket · helpers |

Load order: `data.jsx` → `gapp.jsx`. In production compile JSX at build time; don't ship Babel standalone.
