# Tech Stack for www.ultramantcg.com

## Frontend

- **Framework:** React 18 (with TypeScript)
- **Build Tool:** Vite
- **Styling:** 
  - Tailwind CSS (with `tailwindcss-animate`, `tailwind-merge`)
  - PostCSS
  - Shadcn/ui component library (Radix UI based)
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Internationalization:** i18next, react-i18next
- **Forms:** react-hook-form, zod (validation)
- **UI/UX Enhancements:** 
  - framer-motion (animations)
  - lucide-react (icons)
  - embla-carousel-react (carousel)
  - recharts (charts)
  - sonner (toasts)
  - vaul (modals/drawers)
- **Other:** date-fns (date utilities), clsx/class-variance-authority (utility classes)

## Backend & Serverless

- **Serverless Functions:** 
  - Supabase Edge Functions (TypeScript, Deno)
  - Functions for product data, session management, email webhooks
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth

## Deployment & Infrastructure

- **Hosting/CI:** Netlify
  - Netlify Functions
  - Netlify redirects and environment configuration
- **Docker:** Docker script present for containerization

## Tooling & Development

- **Linting:** ESLint (with plugins for React, hooks, etc.)
- **Type Checking:** TypeScript
- **Environment Management:** dotenv
- **Testing:** (No explicit testing framework detected, but could be added)

## Notable Packages (from [package.json](cci:7://file:///c:/Users/j/repos/_PCU/www.ultramantcg.com/package.json:0:0-0:0))

- @radix-ui/react-* (accordion, alert-dialog, etc.)
- @supabase/auth-helpers-react, @supabase/supabase-js
- @tanstack/react-query
- react-helmet-async (SEO/head management)
- qrcode.react (QR code generation)
- input-otp (OTP input fields)

## Directory Structure

- `src/` — Main React application code
- [supabase/functions/](cci:7://file:///c:/Users/j/repos/_PCU/www.ultramantcg.com/supabase/functions:0:0-0:0) — Edge/serverless functions (TypeScript/Deno)
- `public/` — Static assets and PWA manifest
- `dist/` — Build output
- [netlify.toml](cci:7://file:///c:/Users/j/repos/_PCU/www.ultramantcg.com/netlify.toml:0:0-0:0) — Netlify configuration
- [tailwind.config.ts](cci:7://file:///c:/Users/j/repos/_PCU/www.ultramantcg.com/tailwind.config.ts:0:0-0:0), [postcss.config.js](cci:7://file:///c:/Users/j/repos/_PCU/www.ultramantcg.com/postcss.config.js:0:0-0:0) — Styling configuration