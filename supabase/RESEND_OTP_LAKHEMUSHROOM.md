# Email OTP via Resend — lakhemushroom.com

Your domain **lakhemushroom.com** is verified on Resend. Follow these steps in the
**Supabase dashboard** so `/login` sends 8-digit codes to **any** email address.

Project: `https://irqwbfegiflwuulhntkk.supabase.co`

---

## 1. Custom SMTP (Resend)

**Project Settings → Authentication → SMTP Settings**

| Field | Value |
| ----- | ----- |
| Enable Custom SMTP | **ON** |
| Host | `smtp.resend.com` |
| Port | `465` |
| Minimum interval | `60` |
| Username | `resend` |
| Password | Your Resend API key (`re_…`) — paste in dashboard only, never commit |
| Sender email | `no-reply@lakhemushroom.com` |
| Sender name | `Lakhe Mushroom Farm` |

Click **Save**, then **Send test email** to confirm delivery.

> Use an address on your verified domain (`lakhemushroom.com`). Do not use
> `onboarding@resend.dev` in production — that only delivers to your Resend signup email.

---

## 2. Email template (show the code)

**Authentication → Email Templates → Magic Link**

**Subject:**
```
Your Lakhe sign-in code
```

**Body (HTML):**
```html
<div style="font-family:Inter,Arial,sans-serif;background:#F7F3EA;padding:32px;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    <h1 style="font-family:Georgia,serif;color:#1B3A2A;font-size:22px;margin:0 0 8px;">
      Sign in to Lakhe Mushroom Farm
    </h1>
    <p style="color:#4A4A4A;font-size:14px;line-height:1.55;margin:0 0 24px;">
      Use the 8-digit code below. It expires in about 10 minutes.
    </p>
    <div style="background:#F0EBDD;border:1px solid #E5DEC9;border-radius:12px;padding:20px;text-align:center;">
      <p style="font-family:'Courier New',monospace;font-size:28px;letter-spacing:8px;font-weight:700;color:#1B3A2A;margin:0;">
        {{ .Token }}
      </p>
    </div>
    <p style="color:#8A8A8A;font-size:12px;margin:24px 0 0;">
      If you didn't request this, you can ignore this email.
    </p>
  </div>
</div>
```

Save the template. The app reads `{{ .Token }}` on the login page.

---

## 3. Auth provider settings

**Authentication → Sign In / Providers → Email**

| Setting | Value |
| ------- | ----- |
| Enable email provider | **ON** |
| Confirm email | **OFF** (OTP-only sign-in) |
| Email OTP length | **8** (matches `OTP_LENGTH` in the app) |

---

## 4. App environment (Vercel + local)

The Resend key stays in **Supabase SMTP only**. The app needs Supabase URL + **JWT anon key**:

```dotenv
VITE_SUPABASE_URL=https://irqwbfegiflwuulhntkk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   # must start with eyJ — NOT sb_publishable_*
```

Get the anon key from **Project Settings → API → Project API keys → anon public** (legacy JWT).

If `VITE_SUPABASE_ANON_KEY` starts with `sb_publishable_`, the app runs in **demo mode**
and OTP emails are not sent.

After updating Vercel env vars, **Redeploy** (Vite bakes env at build time).

---

## 5. Test

1. Visit `/login` on production.
2. Enter any email (e.g. a friend's Gmail).
3. Check inbox + spam for code from `no-reply@lakhemushroom.com`.
4. Enter the 8-digit code on the login page.

If it fails, check **Supabase → Logs → Auth** for SMTP or domain errors.

---

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| No email | Wrong SMTP password; sender not on verified domain |
| Only your Resend email works | Still using `onboarding@resend.dev` as sender |
| "Demo mode" on login | Fix anon key (`eyJ…`) in env and redeploy |
| Code doesn't verify | OTP length in Supabase must be **8** |
| Email has link, no code | Update Magic Link template with `{{ .Token }}` |
