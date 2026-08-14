# Lakhe Mushroom Farm

A production-ready, mobile-first React application for **Lakhe Mushroom Farm** —
premium mushroom products, training and farm-setup consultancy.

> Phase 1 delivers the React foundation and design system only.
> Business features (Supabase, OTP, payments, orders, admin) are not implemented
> yet and will land in later phases.

## Tech stack

- React 18 + TypeScript
- Vite 6
- React Router 6
- Tailwind CSS 3
- Lucide React icons
- ESLint (typescript-eslint)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints.

- `/` — Home
- `/ui-preview` — Design system playground (buttons, forms, cards, overlays…)

All other routes render placeholder pages during Phase 1.

## Project structure

```
src/
├── assets/
├── components/
│   ├── ui/          # Button, Badge, Card, Modal, BottomSheet, Skeleton
│   ├── layout/      # AppShell, Header, PageContainer, Section, Layout
│   ├── navigation/  # LakheLogo, MobileBottomNav
│   ├── cards/       # Product, Training, Feature, Stat, Story, Info, Media, Order
│   ├── forms/       # Input, Textarea, Select, Checkbox, Radio, OTPInput, FileUpload, DateInput
│   ├── media/       # ResponsiveImage, ResponsiveVideo, media skeletons
│   └── feedback/    # Alert, ToastProvider, States (empty/success/error/loading)
├── pages/           # HomePage, UIPreviewPage, PlaceholderPage, NotFoundPage
├── routes/          # AppRoutes
├── data/
├── hooks/
├── types/
├── utils/           # cn, formatINR
├── styles/
│   ├── globals.css
│   └── tokens/      # design tokens (TS)
├── App.tsx
└── main.tsx
```

## Design system

Design tokens live in [tailwind.config.js](tailwind.config.js) and
[src/styles/tokens/index.ts](src/styles/tokens/index.ts). Never hard-code colours,
spacing or radii inside components — reference the tokens or Tailwind classes.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build production bundle
- `npm run lint` — run ESLint
- `npm run preview` — preview the production bundle locally

## Supabase email OTP setup (important)

The sign-in flow uses Supabase's `signInWithOtp` — the user gets a 6-digit code
by email and enters it on the `/login` page. **Supabase's default email template
only sends a magic link, not a code**, so you must update the template once:

1. Open your Supabase project → **Authentication → Email Templates**.
2. Select the **Magic Link** template.
3. Add the token variable to the body. Example:

   ```html
   <h2>Sign in to Lakhe</h2>
   <p>Your 6-digit code is:</p>
   <p style="font-size:24px;letter-spacing:6px;font-weight:bold;">{{ .Token }}</p>
   <p>This code expires in 10 minutes.</p>
   ```

4. Save. New sign-in emails will now contain the OTP code.

Also make sure the sender email is verified in **Authentication → SMTP Settings**
(the default Supabase sender has strict rate limits — connect your own SMTP for
production).

### Admin emails

Set `VITE_ADMIN_EMAILS` in `.env.local` to a comma-separated list of admin
emails. Anyone signing in with one of those addresses gets `is_admin = true`
in their profile automatically.
