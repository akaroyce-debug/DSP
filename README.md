# RoyceDSP

The digital home for **RoyceDSP** — a future-forward luxury audio intelligence
brand. A cinematic, glassmorphic single-page experience with a full product
catalogue, a protected management console, and Stripe checkout scaffolding
ready to activate.

> Quiet luxury. Frosted depth. Buttery, momentum-based scrolling. Built to feel
> more spatial and considered than the best brand sites — and ready for your
> real video, photography, and 3D models.

---

## Stack

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, React 19, TypeScript strict)          |
| Styling        | Tailwind CSS 4 + a custom glass design system                 |
| Motion         | Framer Motion (`motion`) + Lenis smooth scroll                |
| 3D             | `@react-three/fiber` + `@react-three/drei`                    |
| Data           | Drizzle ORM + Turso (libSQL); local SQLite file in dev        |
| Forms          | React Hook Form + Zod                                         |
| Mutations      | Server Actions                                                |
| Payments       | Stripe — **scaffolded, not active**                           |

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
#    Local dev works out of the box — a file-based SQLite db (local.db) is used
#    when TURSO_DATABASE_URL is empty. Set ADMIN_PASSWORD + ADMIN_SESSION_SECRET.

# 3. Create the schema and seed six example products
npm run setup            # = db:generate + db:migrate + db:seed

# 4. Run
npm run dev              # http://localhost:3000
```

Admin console lives at **`/admin`** (password = `ADMIN_PASSWORD`).

### Scripts

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Dev server (Turbopack)                             |
| `npm run build`       | Production build                                   |
| `npm run start`       | Serve the production build                         |
| `npm run lint`        | ESLint                                             |
| `npm run setup`       | Generate migrations, apply them, then seed         |
| `npm run db:generate` | Generate SQL migrations from the schema            |
| `npm run db:migrate`  | Apply migrations (non-interactive; CI-safe)        |
| `npm run db:seed`     | Re-seed example products (clears + re-inserts)     |
| `npm run db:studio`   | Open Drizzle Studio                                |

---

## Project structure

```
src/
  app/
    page.tsx                 # Public single-page experience
    products/[slug]/page.tsx # Rich product detail page
    admin/                   # Protected console + login
    api/stripe/              # checkout + webhook (scaffolded)
  components/
    ui/glass/                # Design primitives: button, card, modal, input, magnetic
    placeholders/            # Video / Image / 3D placeholders (production-ready)
    three/                   # The soundform R3F scene
    sections/                # Hero, Vision, Collection, Technology, Experience, Footer, Nav
    motion/                  # Scroll-reveal helpers
    admin/                   # Dashboard, product CRUD, orders
    providers/               # Lenis smooth-scroll provider
  lib/
    db/                      # Drizzle schema, client, queries, seed, migrate
    actions/                 # Server actions (products, orders, auth, newsletter)
    auth.ts / auth-server.ts # Signed-cookie admin auth
    stripe.ts                # Stripe client + types (inactive)
    validation.ts            # Zod schemas
  proxy.ts                   # Edge auth guard for /admin (Next 16 "proxy" convention)
```

---

## Design system

All glass surfaces share utilities defined in `src/app/globals.css`:
`.glass`, `.glass-strong`, `.glass-sheen` (light sweep), plus the `--color-*`
tokens (paper, ink, bronze) and the `EASE` curves in `src/lib/motion.ts`.
Primitives in `components/ui/glass` (`GlassButton`, `GlassCard`, `GlassModal`,
`GlassInput`, `Magnetic`) compose these. Everything respects
`prefers-reduced-motion`.

---

## Replacing the placeholders with real assets

The placeholders are designed to look premium today and swap cleanly later.

- **Video** — `components/placeholders/video-placeholder.tsx`. Replace the
  inner backdrop with a `<video>` (see the comment block in the file).
- **Image** — `components/placeholders/image-placeholder.tsx`. Drop in
  `next/image` with `fill`, keeping the wrapper aspect + radius.
- **3D** — `components/three/soundform.tsx`. Replace `<MorphingCore>` with a
  drei `useGLTF("/models/<product>.glb")` `<primitive>`; keep the lighting rig
  and `<Float>` wrapper. Per-product media is set in the admin (media `kind`
  of `model` / `image` / `video`).

---

## Admin & data

- Auth is a single env-based password (`ADMIN_PASSWORD`) issuing an
  HMAC-signed, httpOnly session cookie (`ADMIN_SESSION_SECRET`). The
  `proxy.ts` guard protects `/admin/*`. Upgrade to better-auth later by
  swapping the helpers in `lib/auth.ts` — the UI won't change.
- Products and orders are full CRUD via Server Actions with Zod validation.
  Prices are stored as integer **cents**.
- Going to production with Turso:
  ```bash
  # Create a db with the Turso CLI, then set in your host's env:
  TURSO_DATABASE_URL=libsql://<db>.turso.io
  TURSO_AUTH_TOKEN=<token>
  npm run db:migrate   # apply schema to Turso
  npm run db:seed      # optional
  ```

---

## Enabling Stripe (when ready)

Payments are intentionally inactive. The checkout API returns `503` and the UI
shows a calm "coming soon" note until you provide keys.

1. Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`,
   and `NEXT_PUBLIC_SITE_URL` in your environment.
2. `src/app/api/stripe/checkout/route.ts` already creates a real Checkout
   Session once a key is present — no code change needed.
3. Point a Stripe webhook at `{SITE_URL}/api/stripe/webhook`
   (`checkout.session.completed`). Paid orders are recorded automatically.

---

## Deploying to Vercel

1. Push to GitHub and import the repo into Vercel.
2. Add env vars (`TURSO_*`, `ADMIN_*`, and `STRIPE_*` when enabling payments).
3. Run `npm run db:migrate` against your Turso database once.
4. Deploy. The home and admin routes are server-rendered on demand; the 3D
   scene loads only on the client when scrolled into view.

---

## Accessibility & performance notes

- WCAG-minded: focus-visible rings, labelled controls, reduced-motion paths.
- 3D is client-only, lazy, and gated on viewport visibility.
- Lenis is disabled under reduced-motion; native scroll takes over.
