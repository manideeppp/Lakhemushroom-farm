# SETUP — Supabase, Resend email OTP, and Admin portal

Follow these steps end-to-end to move Lakhe Mushroom Farm from local demo mode
into a real, production-ready deployment.

- [1. Prerequisites](#1-prerequisites)
- [2. Create a Supabase project](#2-create-a-supabase-project)
- [3. Run the database schema](#3-run-the-database-schema)
- [4. Configure Resend as the SMTP provider](#4-configure-resend-as-the-smtp-provider)
- [5. Turn the Magic Link into a 6-digit OTP](#5-turn-the-magic-link-into-a-6-digit-otp)
- [6. Wire the app to Supabase (.env.local)](#6-wire-the-app-to-supabase-envlocal)
- [7. Admin portal (`/admin`)](#7-admin-portal-admin)
- [8. Test the full flow](#8-test-the-full-flow)
- [9. Deploy (Vercel / Netlify)](#9-deploy-vercel--netlify)
- [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

You need free accounts on:

- [Supabase](https://supabase.com) — database, auth, storage.
- [Resend](https://resend.com) — the email service that delivers the OTP.
- A domain email you can send from (e.g. `no-reply@lakhemushroomfarm.com`).
  If you don't have one yet, Resend's default `onboarding@resend.dev` works
  for testing only.

Node 18+ and npm 9+ locally.

---

## 2. Create a Supabase project

1. Log into [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click **New project**.
   - **Name**: `lakhe-mushroom-farm`
   - **Region**: closest to your customers (e.g. `Mumbai` for India).
   - **Database password**: generate + save it in a password manager.
3. Wait ~2 minutes for the project to be ready.
4. Go to **Settings → API** and copy:
   - **Project URL** → this becomes `VITE_SUPABASE_URL`.
   - **anon public key** → this becomes `VITE_SUPABASE_ANON_KEY`.

Keep this tab open — you'll paste these into `.env.local` in step 6.

---

## 3. Run the database schema

The schema is in [supabase/schema.sql](supabase/schema.sql). It creates all
tables, RLS policies, triggers, and the payment-screenshots storage bucket.

1. In the Supabase dashboard sidebar, open **SQL Editor → New query**.
2. Paste the **entire contents** of [supabase/schema.sql](supabase/schema.sql).
3. Click **Run** (or press ⌘+Enter). You should see "Success. No rows returned".
4. Verify: **Table editor** should now list `profiles`, `products`, `orders`,
   `training_courses`, `training_modules`, `training_progress`, `order_items`,
   `offline_bookings`, `queries`, `gallery_items`, `testimonials`.

### (Optional) Seed sample data

If you want products / training / gallery pre-populated, run
[supabase/seed.sql](supabase/seed.sql) the same way.

---

## 4. Configure Resend as the SMTP provider

Supabase's built-in email sender has a **strict 3-per-hour rate limit** and
often lands in spam. We route all auth emails through Resend instead.

### 4a. Create a Resend account & API key

1. Sign up at [resend.com](https://resend.com).
2. Verify your account email.
3. Go to **API Keys → Create API Key**.
   - **Name**: `supabase-auth`
   - **Permission**: `Sending access`
   - Copy the key (starts with `re_`) — you'll paste it into Supabase in a moment.

### 4b. Verify a sending domain (recommended)

For production you want emails to come from your own domain.

1. In Resend, go to **Domains → Add Domain**.
2. Enter `lakhemushroomfarm.com` (or whatever domain you own).
3. Resend gives you **DNS records** (SPF, DKIM, MX). Add them at your domain
   registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Wait for Resend to show all records ✅ (usually a few minutes, up to 24h).

If you're only testing, skip this and use `onboarding@resend.dev` as the
"From" address — but **do not ship** with that address.

### 4c. Point Supabase at Resend (SMTP)

1. In Supabase go to **Project Settings → Authentication → SMTP Settings**.
2. Toggle **Enable Custom SMTP** on.
3. Fill in:

   | Field                | Value                                      |
   | -------------------- | ------------------------------------------ |
   | Host                 | `smtp.resend.com`                          |
   | Port                 | `465`                                      |
   | Minimum interval     | `60` (seconds — Supabase default is fine)  |
   | Username             | `resend`                                   |
   | Password             | your Resend API key from step 4a           |
   | Sender email         | `no-reply@lakhemushroomfarm.com` (or the resend.dev address for testing) |
   | Sender name          | `Lakhe Mushroom Farm`                      |

4. Click **Save**.
5. Click **Send test email** and check your inbox — it should arrive from your
   sender address.

---

## 5. Turn the Magic Link into a 6-digit OTP

This is the fix for the "Confirm your email address" issue you saw. Supabase's
default template only renders a link — we want a code.

1. In Supabase go to **Authentication → Email Templates**.
2. Select the **Magic Link** template.
3. Replace the subject and body with:

   **Subject**
   ```
   Your Lakhe sign-in code
   ```

   **Message body (HTML)**
   ```html
   <div style="font-family:Inter,Arial,sans-serif;background:#F7F3EA;padding:32px;">
     <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
       <h1 style="font-family:Georgia,serif;color:#1B3A2A;font-size:22px;margin:0 0 8px;">
         Sign in to Lakhe Mushroom Farm
       </h1>
       <p style="color:#4A4A4A;font-size:14px;line-height:1.55;margin:0 0 24px;">
         Use the 6-digit code below to finish signing in. This code expires in 10 minutes.
       </p>
       <div style="background:#F0EBDD;border:1px solid #E5DEC9;border-radius:12px;padding:20px;text-align:center;">
         <p style="font-family:'Courier New',monospace;font-size:32px;letter-spacing:10px;font-weight:700;color:#1B3A2A;margin:0;">
           {{ .Token }}
         </p>
       </div>
       <p style="color:#8A8A8A;font-size:12px;line-height:1.55;margin:24px 0 0;">
         Didn't try to sign in? You can safely ignore this email.
       </p>
     </div>
   </div>
   ```

4. Click **Save**.

> **Why this works:** the `{{ .Token }}` variable renders the 6-digit code
> Supabase already generates. When your user enters that code on the `/login`
> screen, `supabase.auth.verifyOtp` accepts it.

You can leave the "Confirm signup" and "Recovery" templates alone (or apply
the same style — same `{{ .Token }}` variable).

### 5a. Disable "Confirm email" if you don't need it

By default Supabase forces users to confirm their email even when signing in
with OTP. For a friction-free experience:

1. Go to **Authentication → Sign In / Providers → Email**.
2. Turn **Confirm email** **OFF**.
3. Keep **Enable email provider** ON.

Now the flow becomes: email in → 6-digit code out → user typed code → signed in.

---

## 6. Wire the app to Supabase (.env.local)

1. In your project root, copy the example env file:

   ```bash
   cp .env.example .env.local
   ```

2. Open [.env.local](.env.local) and fill in:

   ```dotenv
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   # long JWT
   VITE_ADMIN_PASSWORD=change-me-to-a-strong-random-string
   VITE_ADMIN_EMAILS=you@yourdomain.com
   ```

3. Restart the dev server (Vite only reads env at startup):

   ```bash
   npm run dev
   ```

The app is now in **real backend mode**. The demo "any 6-digit OTP works"
banner on `/login` disappears.

---

## 7. Admin portal (`/admin`)

The admin portal is **completely separate** from user login. Users use
email + OTP; the admin uses a single shared password.

- Route: **`/admin/login`** — password entry screen.
- Route: **`/admin`** — dashboard (protected by session).
- Sessions last **8 hours** and are stored in `localStorage`.
- Password comes from **`VITE_ADMIN_PASSWORD`** in `.env.local`.
- Default (dev only): `lakhe-admin-2026`. **Change this before deploying.**

To rotate the password: change `VITE_ADMIN_PASSWORD` in `.env.local` and
redeploy. Any existing admin sessions in browsers keep working until they
expire — clear them manually if you need to force a re-login.

> **Note on security:** because Vite env vars are baked into the client
> bundle, this is a **shared secret**, not a per-user login. It's meant for
> a small team that trusts each other. If you need per-user admin accounts,
> switch to the email-OTP flow and set the `is_admin` flag on the profile
> row in Supabase (`profiles.is_admin = true`).

---

## 8. Test the full flow

Do this once end-to-end to confirm everything works:

1. **User sign-in**
   1. Visit `/login`.
   2. Enter your email → click "Send code".
   3. Check your inbox (and spam) — you should see the styled Lakhe email
      with a big 6-digit code.
   4. Enter the code → click "Verify & continue" → you land on `/account`.

2. **Place an order (optional)**
   1. Add a product to the cart.
   2. Go to `/cart` → Checkout → `/payment`.
   3. Enter a fake UPI reference and upload any screenshot.
   4. Submit — go to `/orders` to see it as "pending verification".

3. **Admin approves the order**
   1. Open a new tab (or private window) → visit `/admin/login`.
   2. Enter your `VITE_ADMIN_PASSWORD`.
   3. On the dashboard you'll see the pending order.
   4. Click into it → **Approve** → the user's order status updates.

---

## 9. Deploy (Vercel / Netlify)

### Vercel

1. Push to GitHub (already done → `manideeppp/Lakhemushroom-farm`).
2. Go to [vercel.com/new](https://vercel.com/new), pick the repo.
3. Framework preset: **Vite**.
4. **Environment Variables**: add every `VITE_*` variable from your
   `.env.local`. Don't skip the admin password.
5. Deploy.
6. In **Supabase → Authentication → URL Configuration**, add your Vercel
   URL (e.g. `https://lakhe.vercel.app`) to **Site URL** and to
   **Redirect URLs**.

### Netlify

Same idea. Framework: Vite. Build command: `npm run build`. Publish dir: `dist`.

---

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Email arrives but only has a "Confirm email address" link, no code | You skipped **Step 5** — put `{{ .Token }}` into the Magic Link template body. |
| No email arrives at all | Check **Supabase → Logs → Auth** for errors. Usually SMTP creds wrong (step 4c) or the Resend sending domain isn't verified. |
| Emails land in spam | Verify your domain in Resend (step 4b) and use a `no-reply@yourdomain.com` sender. |
| `/admin/login` says "Admin password is not configured" | You forgot `VITE_ADMIN_PASSWORD` in `.env.local` **and** restart `npm run dev`. |
| Login page still shows "Demo mode" banner | Supabase env vars are missing/blank — check `.env.local` and restart Vite. |
| `Row Level Security` errors when placing an order | Re-run [supabase/schema.sql](supabase/schema.sql). The RLS policies live at the bottom of that file. |
| Admin session persists after password change | It's a client session; open DevTools → Application → Local Storage → delete `lakhe.admin.session`, or wait 8 hours. |

---

Once these steps are done, `/login` will send real 6-digit OTPs via Resend and
`/admin/login` will gate the admin dashboard with your password. You're
production ready.
