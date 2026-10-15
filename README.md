# Abinesh V — The Interactive Developer Experience

A single-page React + Vite portfolio: a GSAP ScrollTrigger "sticky portrait" story, a
site-wide motion system, dark/light themes, a Ctrl/⌘ K command palette, a local developer
terminal, an interactive technology universe and a scratch-to-reveal email card.
Frontend only — no backend, database, or API server.

## Interactive features

| Feature | Where | Notes |
| --- | --- | --- |
| Pull-cord lamp theme switch | Nav, right side (`PullCordThemeSwitch.jsx`, `styles/lamp.css`) | Lamp ON = light theme, OFF = dark. Drag the cord down (mouse/touch) or click/tap it; Enter/Space work. Visible "Light / Dark" label. First visit is always dark; the choice persists in `localStorage` (`av-theme`) and is applied before first paint. |
| Command palette | `Ctrl K` / `⌘ K`, or the nav button | Type to filter, ↑/↓, Enter, Esc. Copy-email / resume commands appear only when configured. |
| Developer terminal | "Explore" section, or palette → *Open the developer terminal* | `help about experience skills projects contact clear`; ↑/↓ history, Tab completes. Answers come from `src/data/`. |
| Technology universe | Skills chapter | Arrow keys move between categories; hover/focus a tool for its description. Becomes a grid on phones. |
| Scratch card | Contact | Canvas + Pointer Events (mouse, pen, touch). Reveals at ~45%; *Reveal* button for keyboard users; *Copy email*. Nothing is stored or sent. |
| Project drawer | Click any project card | Objective, role, feature status, full stack, links. |
| Cursor + magnetic CTAs | Desktop fine pointers only | Disabled for touch and reduced motion; the native cursor is never hidden. |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run build      # outputs to dist/
npm run preview    # serve the production build at http://localhost:4173
```

Requires Node.js 20.19+ (22 recommended).

## Edit your content

Everything you'll want to change lives in `src/data/`:

| File | What's in it |
| --- | --- |
| `profile.js` | Name, roles, headline, **`email`** (one value powers the scratch card, copy buttons, palette and terminal), LinkedIn/GitHub, resume, About text, grouped experience, approach, milestones, certifications |
| `projects.js` | All five projects — status, features, stack, and **GitHub / demo URLs** (empty → "Links coming soon") |
| `skills.js` | Skill groups, the three disciplines, marquee words |
| `analytics.js` | **Sample** dashboard data for the analytics showcase (labeled as illustrative on the site) |

Things to fill in before launch:

1. `profile.email` — while empty, the scratch card shows a setup message in `npm run dev` and a LinkedIn note in production. Nothing fake is ever shown.
2. `github` / `demo` URLs for each project in `projects.js`.
3. Project `status` and `features[].state` — confirm they match reality.
4. Testing project: add automation frameworks to `stack` only once you've used them (or to `futureTools`, which is labeled "future addition").
5. Real screenshots: import an image and set `image:` on a project — it replaces the illustrative mockup.
6. `certifications` in `profile.js` — the section only lists items you add.

### Photos

Two photographs are used (originals kept untouched in `src/assets/images/originals/`):

| Photo | Original | Optimised files | Used in |
| --- | --- | --- | --- |
| 1 | `photo-1-original.png` (816 × 1224, transparent) | `photo-1.webp`, `photo-1-544.webp`, `photo-1.png` | Hero (right) → About (left) → travels right |
| 2 | `photo-2-original.png` (1024 × 1536) | `photo-2.webp`, `photo-2-640.webp`, `photo-2.jpg` | Revealed for Experience (right) |

Both are 2:3, so Photo 1 lands in exactly the box where Photo 2 is revealed. Mapping lives in `src/data/photos.js`.

## How the scroll story works

`src/sections/ScrollStory.jsx` wraps **Hero → 01 About → 02 Experience** with one `position: sticky` stage
that holds one Photo 1 element and one Photo 2 element (no duplicates):

1. **Hero** — text left, Photo 1 right.
2. **Move 1** (scrubbed) — Photo 1 glides to the **left** while the hero copy lifts away; About's text arrives on the **right**.
3. **Move 2** (scrubbed) — as About finishes, Photo 1 scales down and travels **left → right**; when it arrives, Photo 2 is mask-revealed in the same box and becomes the visual for Experience (with a subtle parallax).
4. The stage ends with Experience and releases before **03 Tech Stack**.

Geometry is measured from invisible anchor boxes on every `ScrollTrigger.refresh()`, both moves reverse cleanly
when scrolling up, and content sits above the stage so text is never behind a photo.
Below 1024px the sequence becomes a natural stack (Photo 1 → content → Photo 2 → timeline);
with reduced motion the same three positions switch instantly.

## Motion system

> **Why sections 01–04 used to look empty:** reveals hid content up front and relied on `once: true`
> `onEnter` callbacks, which only fire when scrolling *down past* a start line. When the page was already
> scrolled as the triggers were created (a `#section` link, a restored position, a hot reload, a fast jump),
> they never fired and the content stayed at `opacity: 0`. `useMotion.js` now reveals on enter, enter-back,
> jump-past and refresh, clamps start lines at the page end, and never leaves content hidden.

`src/hooks/useMotion.js` drives every section with a few patterns, chosen per element with
`data-reveal` (`fade`, `rise`, `left`, `right`, `scale`, `pop`, `clip`, `panel`, `line`),
`data-split` headings (word-by-word) and `data-count` count-ups. Content is visible in plain
HTML; motion only runs when GSAP loads and `prefers-reduced-motion` allows it. Entrances play
once; scrubbed lines (timeline, workflow) follow the scroll in both directions.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository (e.g. `Abinesh-FullStack/portfolio`) on the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually). `.github/workflows/deploy.yml` lints, builds, and deploys.

The workflow sets the Vite `base` automatically:

- Repo named `Abinesh-FullStack.github.io` → site at `https://abinesh-fullstack.github.io/`, base `/`
- Any other repo name, e.g. `portfolio` → `https://abinesh-fullstack.github.io/portfolio/`, base `/portfolio/`

It also sets `VITE_SITE_URL` so Open Graph tags use absolute URLs. To build for a specific path manually:

```bash
BASE_PATH=/portfolio/ VITE_SITE_URL=https://abinesh-fullstack.github.io/portfolio/ npm run build
```

Navigation uses section anchors (`#about`, `#projects`, …), so no router or SPA fallback is needed; `public/404.html` links unknown paths back to the site.

## Contact form

There is intentionally no form: a frontend-only form can't send mail securely. The contact CTA uses `mailto:` (once `email` is set) or LinkedIn.
To add a form later, post it to a form service such as Formspree, Getform, or Web3Forms from a small component — no backend needed.

## Stack

React 18 · Vite · GSAP + ScrollTrigger · Lucide icons · hand-written CSS with theme tokens (`src/styles/tokens.css`, `base.css`, `story.css`, `sections.css`) · Archivo, Instrument Serif and JetBrains Mono from Google Fonts.
