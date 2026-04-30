# Handoff: Ai Glow — AI Skincare Companion (Web App)

## Overview
Ai Glow is a personal AI skincare companion. It gives users a daily "read" of their skin, a personalized AM/PM routine, a scannable product shelf with ingredient intelligence, and progress tracking over time. Everything is generated with reference to the user's skin persona, metrics, and product history — calls to Claude produce the daily read, AI Coach tips, ingredient verdicts, and product-fit scores.

**Target platform: Web app (responsive, mobile-first).** The prototype is designed at iPhone proportions (392×840) but the final build should scale cleanly on desktop (e.g., phone-width column centered on desktop, or wider multi-column layouts where appropriate).

## About the Design Files
The files in this bundle are **design references created in HTML** — a pixel-level prototype showing intended look, copy, and flow. They are **not production code to copy directly**. The task is to **recreate these designs in a real codebase** using modern web-app patterns and production-grade state/data/AI integration.

**Recommended stack (change to taste):**
- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + CSS variables for theme tokens (light/dark)
- **Database / Auth:** Supabase (Postgres + Auth + Storage)
- **AI:** Anthropic Claude via a **server-side** route handler (never call the API from the client — the API key must stay on the server)
- **Hosting:** Vercel
- **Fonts:** Fraunces (serif) + Inter Tight (sans) via `next/font/google`

## Fidelity
**High-fidelity.** All colors, spacing, type, radii, and interactions are final. Recreate pixel-perfectly. The only area left to you is responsive layout above mobile width (phone-column-centered is the safest default; a 2-column desktop layout for Dashboard + Routine is a nice extension).

---

## Design Tokens

### Colors — Light
| Token | Value | Use |
|---|---|---|
| `--bg` | `#f7f2ea` | App background (cream) |
| `--bg-elevated` | `#fbf7f0` | Elevated cream |
| `--bg-sunken` | `#efe6d8` | Recessed fill, muted chips |
| `--surface` | `#ffffff` | Cards, sheets |
| `--ink` | `#1a1a17` | Primary text |
| `--ink-2` | `#4a443c` | Secondary text |
| `--ink-3` | `#8a8074` | Tertiary, eyebrows |
| `--ink-4` | `#b8ad9d` | Disabled / placeholder |
| `--line` | `rgba(26,26,23,0.08)` | Default borders |
| `--line-strong` | `rgba(26,26,23,0.16)` | Strong borders / divider |
| `--accent` | `#4a6b4a` | Botanical green (primary) |
| `--accent-ink` | `#ffffff` | Text on accent |
| `--accent-soft` | `#e6ece0` | Accent-tinted fill |
| `--accent-2` | `#2d4a2d` | Deep accent text |
| `--warn` | `#c07556` | Terracotta (alerts) |
| `--warn-soft` | `#f3e2d6` | Warn chip fill |

### Colors — Dark
| Token | Value |
|---|---|
| `--bg` | `#161513` |
| `--bg-elevated` | `#1e1c19` |
| `--bg-sunken` | `#0f0e0c` |
| `--surface` | `#25221e` |
| `--ink` | `#f5efe4` |
| `--ink-2` | `#cfc6b6` |
| `--ink-3` | `#9a9081` |
| `--ink-4` | `#5f584c` |
| `--line` | `rgba(245,239,228,0.10)` |
| `--line-strong` | `rgba(245,239,228,0.18)` |
| `--accent` | `#8aa880` |
| `--accent-ink` | `#141611` |
| `--accent-soft` | `#2a332a` |
| `--accent-2` | `#b5ccad` |
| `--warn` | `#d98a6a` |
| `--warn-soft` | `#3a2820` |

Theme switching: set `data-theme="dark"` on `<html>`; CSS variables swap.

### Typography
- **Serif (display):** `Fraunces` — weights 400/500. Used for hero text, screen titles, card titles, numeric stats. Letter-spacing `-0.01em`.
- **Sans (UI):** `Inter Tight` — weights 400/500/600. Used for body copy, labels, buttons.
- **Eyebrow style:** 11px, uppercase, letter-spacing 0.14em, color `--ink-3`, weight 500.

Scale used:
| Context | Font | Size | Weight | Line-height |
|---|---|---|---|---|
| Screen H1 | Fraunces | 30px | 400 | 1.05 |
| Hero / dashboard read | Fraunces | 22px | 400 | 1.25 |
| Section title | Fraunces | 20px | 400 | 1.2 |
| Card title (serif) | Fraunces | 17–18px | 400 | 1.2 |
| Big stat | Fraunces | 30–44px | 400 | 1 |
| Body | Inter Tight | 14–15px | 400 | 1.5 |
| Caption | Inter Tight | 12px | 400 | 1.4 |
| Eyebrow | Inter Tight | 11px | 500 | 1 |
| Button | Inter Tight | 14–16px | 500 | 1 |

### Radius
- `--r-sm: 8px` — small chips
- `--r-md: 14px` — inputs
- `--r-lg: 22px` — cards, sheets
- `--r-xl: 32px` — device frame
- 999 — pills, tab-bar

### Shadows
- `--shadow-1: 0 1px 2px rgba(26,18,6,0.04), 0 2px 6px rgba(26,18,6,0.04)`
- `--shadow-2: 0 2px 6px rgba(26,18,6,0.05), 0 12px 30px rgba(26,18,6,0.06)`

### Spacing
Loose 4px-based scale: 4, 8, 10, 12, 14, 16, 18, 20, 22, 26, 30. Screen horizontal padding is **22px**.

---

## Screens / Views

All screens live inside a mobile column. On desktop, center the column at 392–420px width and optionally add a sidebar for top-level nav; the in-phone TabBar can be replaced by a desktop-appropriate nav.

### 1. Onboarding (3-step quiz + selfie)
- **Route:** `/onboarding`
- **Purpose:** Determine skin persona, primary concern, routine complexity; then optional on-device selfie analysis.
- **Layout:** Full-screen column, 40px top padding, 28px horizontal.
- **Step header:** Eyebrow "Step N/4" + Fraunces 30px question.
- **Options:** Vertical list of surface cards (16px radius, var(--line) border), 16px padding, right-chevron icon. Single tap advances.
- **Final step:** Selfie screen — aspect 3:4 rounded frame with dashed oval guide, green accent primary button "Take the photo", secondary "Skip for now".
- **Progress bar:** 4 segments at the bottom, filled with `--accent` through current step.
- **Questions (exact copy):**
  1. "How does your skin usually feel by midday?" → [Tight and a bit dry, Balanced comfortable, Shiny in the T-zone, Very oily all over]
  2. "What are you most hoping to improve?" → [Hydration, Breakouts, Fine lines, Even tone, Redness]
  3. "How many products are in your current routine?" → [1–2 I keep it simple, 3–5 a solid routine, 6+ I love a ritual]

### 2. Dashboard / Today
- **Route:** `/` (after login)
- **Purpose:** Daily read + today's ritual + focus areas.
- **Sections (top-to-bottom):**
  1. **Header:** Eyebrow date ("Sunday · April 19"), Fraunces 26px "Good morning, {name}." + avatar 38×38 circular (tappable → /profile).
  2. **Hero read card** (surface, `--r-lg`, 1px `--line`, shadow-1, padding 20/22): green sparkle icon + eyebrow "This morning's read" (accent color), Fraunces 22px one-line read (AI-generated), 14px body paragraph (AI today-tip). Below: 3 ring stats (Hydration green, Barrier green-gray `#7a8f6b`, Tone terracotta `#c07556`) — size 78px, stroke 6, numeric 32% of size in Fraunces.
  3. **Today's ritual**: Fraunces 20px section title + "{n} steps · {m} min". List of 4 step cards with: circular state dot (done: filled accent + check; now: hollow accent with inner dot; next: hollow ink-4). Now-state card uses `--accent-soft` background with accent border tint. Done rows are tappable to un-check.
  4. **You're working on**: horizontal scroller of concern cards. Each: eyebrow "Focus · Wk N" (accent), Fraunces 18px concern name, 12-segment progress bar (filled segments = `--accent` with 0.9 opacity).
  5. **Scan CTA**: Dashed border 1px button row with scan icon + "Scan a new product" / subtitle "Ingredients + fit for your skin". Tap → opens /scan.
- **Bottom padding:** 140px (for tab bar clearance).

### 3. My Shelf
- **Route:** `/shelf`
- **Purpose:** Browse all user products with fit % and status.
- **Header:** Eyebrow "{n} items · {k} nearly empty", Fraunces 30px "My Shelf".
- **Filter pills:** Horizontal scroll. Options: All, AM, PM, Serum, SPF. Selected pill = dark (ink background, bg text). Unselected = transparent with `--line-strong` border.
- **Grid:** 2-column, 14px gap, 22px horizontal padding.
- **Product tile:**
  - 1:1 photo (12px radius). Top-left badge: `{match}% FIT` — white 90%-opacity pill, `--accent-2` text, 10px 600 weight.
  - Below photo (10px padding): eyebrow brand, Fraunces 16px name, AM/PM badges (10px weight 600, bg `--bg-sunken`, 4px radius), size right-aligned 11px `--ink-3`.
- **Tap** → `/product/{id}`.

### 4. Product Detail
- **Route:** `/product/{id}`
- **Purpose:** Deep dive — match score, ingredient breakdown, usage stats.
- **Hero:** Full-width image 360px tall. Absolute top-left: close button (38×38, white 85% bg, 10px blur). Absolute top-right: pill `{match}% fit for you` — dark 85%, white text.
- **Title block:** eyebrow "{brand} · {type}", Fraunces 28px name, pill row (tag accent, AM/PM default, size default).
- **AI verdict card:** sparkle + eyebrow "AI verdict", Fraunces 19px AI-generated paragraph (specific to user's current metrics). Stat row below: Opened, Shelf life, Used.
- **Key ingredients list:** Each row = dot (good=accent, neutral=`--ink-4`) + name + reason in `--ink-3`. Separated by `--line` 1px.

### 5. Routine
- **Route:** `/routine`
- **Purpose:** Step-by-step morning/evening routine with checkable steps and AI Coach insight.
- **Header:** Eyebrow "Built for {persona label}", Fraunces 30px "Routine", 14px body description.
- **AM/PM toggle:** 2-column segmented control with sun/moon icons. Active segment = `--surface` with shadow-1. Tab = `'AM' | 'PM'` in local state.
- **Steps list:** Vertical with a 1px `--line-strong` spine at left:36px running from top to bottom of list.
- **Step row:**
  - Number button (28×28, `--accent` border, `--bg` fill, Fraunces 13px accent number). **Tappable** — toggles done state. Done = filled accent + white check icon, card opacity 0.55, title strikes through, right meta reads "Done" instead of "Step N".
  - Card body (surface, 16px radius, `--line` 1px): Fraunces 17px title, "Step {n}" right-aligned, 13px product name in `--ink-2`, 12px instruction in `--ink-3`.
- **AI Coach card** at bottom: `--accent-soft` bg, `rgba(74,107,74,0.18)` border, sparkle + eyebrow "AI Coach" in `--accent-2`, Fraunces 17px AI quote (quoted).
- **Persistence:** Done state should persist per user per day (store under `routine_checkins` keyed by `user_id + date + step_key`).

### 6. Profile
- **Route:** `/profile`
- **Purpose:** Streak, skin stats, settings.
- **Header:** Eyebrow "Profile", Fraunces 30px name, 13px persona label in `--ink-3`.
- **Streak card:** Full-width dark card (ink bg, bg text). Left: Fraunces 44px "27", eyebrow "Day streak". Right: 14 vertical bars (14×24, completed = `#8aa880`, missed = white 15%). Bottom caption: "AM + PM completed 12 of last 14 days."
- **Stat grid:** 2×2 (Skin age / Products tracked / Check-ins / Barrier avg). Each card: eyebrow label, Fraunces 30px value, 11px delta in `--ink-3`.
- **Settings list:** Single rounded surface group. Rows: Skin goals & concerns, Reminders, Environmental inputs, Sync from Apple Health, Data & privacy. Chevron right, 1px `--line` divider.

### 7. Scan Flow (modal)
- **Trigger:** Scan tab in bottom bar, or dashboard CTA.
- **Stages:** `'scan' → 'analyzing' → 'result'` with ~1.8s and ~2s auto-advance for demo. Real implementation:
  - `scan` = camera viewfinder (`navigator.mediaDevices.getUserMedia`), with green animated scan line across a bracketed crop area. Copy: eyebrow "Align the label", Fraunces 22px "Reading the product…".
  - `analyzing` = same viewfinder frozen, progress bar animates to 100% (2s). Copy: "Matching to you" / "Cross-referencing 36 ingredients…". Call Claude with extracted OCR text here.
  - `result` = light-theme full-screen card:
    - Eyebrow "Match found" (accent), Fraunces 30px product name.
    - Hero image 5:3.
    - Accent-soft verdict card (fit % + Fraunces 19px AI copy).
    - 2×2 meta grid: pH, Fragrance, Alcohol, Actives.
    - Primary button "Add to my shelf" (accent), secondary "Not interested".

### 8. Tab Bar (bottom nav)
- **Items:** Today · Shelf · **Scan** · Routine · You
- **Style:** Floating pill, 12px from edge, 10/8 padding, `--surface` 85% + backdrop-blur 24px sat 160%, `--line` border, shadow-2, 28px radius.
- **Primary Scan button:** 52×52 circle, `--accent` bg, white icon, `translateY(-6px)` (lifts above the bar), shadow `0 8px 20px rgba(74,107,74,0.35)`.
- **Desktop:** Replace with left sidebar or top horizontal nav.

---

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| Tap avatar (Dashboard) | → /profile |
| Tap dashboard ritual step | Toggle done, confetti-free, persist server-side |
| Tap routine step number | Toggle done with optimistic UI |
| Tap routine step card body | Open product detail (if linked) |
| Tap AM/PM toggle | Switch visible steps |
| Tap shelf filter | Filter grid |
| Tap shelf tile | → /product/{id} |
| Tap product Close | → back (router.back or /shelf) |
| Tap scan tab | Open scan modal overlay |
| Tap scan modal "Add to shelf" | POST to /api/shelf, close modal, toast |

**Animations:**
- Scan line: 1.6s linear infinite vertical sweep.
- Analyzing progress: 2s ease-out width 0→100%.
- All state transitions: 160ms ease on opacity/background/color.

**Responsive:**
- Below 480px: full viewport width.
- 480–900px: center 420px column on cream gradient bg.
- 900px+: center column + Tweaks/settings rail OR 2-column dashboard+routine layout.

---

## State Management

**Client state (React Context or Zustand):**
- `user`, `persona` (one of: combination / oily / dry / mature)
- `theme` (light/dark) — also persisted in localStorage + synced to DB preference
- current screen / nav

**Server state (Supabase queries, suggest TanStack Query):**
- `profiles` — user profile + persona + skin goals
- `products` — user's shelf
- `routines` — AM/PM step list per user
- `routine_checkins` — `{user_id, date, step_key, completed_at}`
- `skin_reads` — daily AI-generated hero read + metrics (hydration, barrier, tone)
- `product_fits` — cached Claude ingredient analyses, keyed `{user_id, product_id}`

**Suggested DB schema (Supabase / Postgres):**

```sql
create table profiles (
  id uuid primary key references auth.users,
  name text,
  persona text check (persona in ('combination','oily','dry','mature')),
  concerns text[],
  theme text default 'light',
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  brand text, name text, type text, size text,
  image_url text,
  steps text[],           -- ['AM','PM']
  tag text,
  opened_at date,
  match_score int,        -- 0–100, last Claude-scored
  created_at timestamptz default now()
);

create table routine_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date,
  period text check (period in ('AM','PM')),
  step_index int,
  completed_at timestamptz default now(),
  unique (user_id, date, period, step_index)
);

create table skin_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date unique,
  hero_line text,
  tip text,
  hydration int, barrier int, tone int,
  created_at timestamptz default now()
);

create table product_fits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  match_score int,
  verdict text,
  ingredients jsonb,  -- [{name, reason, tone: 'good'|'neutral'|'bad'}]
  created_at timestamptz default now(),
  unique (user_id, product_id)
);
```

---

## Claude API Integration

**Critical:** Never call Anthropic from the browser. Create server-only API routes.

### Suggested route handlers (Next.js App Router)

**`app/api/daily-read/route.ts`** — generates today's hero line + tip + metrics.
Input: user persona, recent check-ins, yesterday's metrics.
Output: `{hero, tip, hydration, barrier, tone}` persisted to `skin_reads`.

**`app/api/product-fit/route.ts`** — analyzes a product against the user's skin profile.
Input: product name + brand + ingredient list (from OCR or lookup) + user persona/metrics.
Output: `{match_score, verdict, ingredients: [{name, reason, tone}]}` persisted to `product_fits`.

**`app/api/routine-coach/route.ts`** — AI Coach insight for the Routine screen.
Input: user persona, recent check-ins, current routine.
Output: `{quote}` (the Fraunces 17px line shown in the accent-soft card).

**`app/api/scan/route.ts`** — receives OCR text from the camera, calls Claude to parse ingredients & return match.

**Example route (pseudocode):**
```ts
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const { persona, metrics } = await req.json();
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 400,
    system: `You are Ai Glow's skincare reader. Write in a warm, editorial tone. Output JSON: {"hero": string (<=80 chars, no emojis), "tip": string (<=180 chars), "hydration": 0-100, "barrier": 0-100, "tone": 0-100}.`,
    messages: [{ role: 'user', content: `Persona: ${persona}\nRecent metrics: ${JSON.stringify(metrics)}\nGenerate today's read.` }],
  });
  // parse and persist
}
```

**Prompting guidance:**
- Voice: editorial, warm, specific. Never use "your skin deserves" / corporate wellness clichés. Think a thoughtful friend who happens to know dermatology.
- Never invent ingredients. If OCR is ambiguous, ask the client to re-scan.
- Keep hero lines under 80 chars; tips under 180 chars. Fits into the layouts above.
- Always return structured JSON for UI binding.

---

## Assets

- **Fonts:** Fraunces & Inter Tight from Google Fonts.
- **Icons:** Currently inline SVGs in the prototype. In production use **Lucide** (lucide-react) — map: `Camera`→scan, `Home`, `Layers`→shelf, `Sparkles`, `Droplet`, `Sun`, `Moon`, `ChevronRight`, `Plus`, `Check`, `X`, `Flame`.
- **Product photos:** Real Unsplash photos used as placeholders. Replace with user-uploaded images stored in Supabase Storage. Sample IDs used: 1556228720-195a672e8a03, 1631730359585, 1608248543803, 1556228852, 1612532774233, 1620916566398.
- **Avatar photo:** placeholder from Unsplash (1544005313-94ddf0286df2) — replace with user upload.

---

## Files in this bundle
- `Ai Glow.html` — the full interactive prototype. Open in a browser to see every screen, try Tweaks (theme + persona), tap through navigation. Components live inline: `Dashboard`, `Shelf`, `Routine`, `Profile`, `ProductDetail`, `Onboarding`, `ScanFlow`, `TabBar`, `Phone`, plus a `PERSONAS` and `PRODUCTS` data map that shows how content varies by persona.
- `tokens.css` — ready-to-use CSS custom properties (light + dark). Drop into `globals.css` and you have the full theme.
- `README.md` — this file.

## Suggested implementation order
1. Scaffold Next.js + Tailwind + Supabase + Anthropic SDK. Drop in `tokens.css` + fonts.
2. Build Phone shell + TabBar + routing skeleton (stub all screens).
3. Auth + Onboarding flow writing to `profiles`.
4. Dashboard reading from `skin_reads` (call `/api/daily-read` if today's row is missing).
5. Routine with `routine_checkins` + `/api/routine-coach`.
6. Shelf CRUD + Product detail + `/api/product-fit`.
7. Scan flow with `getUserMedia` + OCR (Tesseract.js or a vision-capable Claude call with image input) + `/api/scan`.
8. Profile: settings, streak calc (select from `routine_checkins` grouped by date).
9. Dark mode, a11y pass, keyboard nav, loading/error states.

Ship v1 with persona hardcoded per user after onboarding; add re-onboarding later. Keep Claude calls cached in the `skin_reads` / `product_fits` tables to keep costs down.
