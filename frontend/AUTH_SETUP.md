# Authentication Setup

Manual configuration required for Supabase Auth and Google OAuth.

---

## Supabase Configuration

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → Your project → **Authentication** → **Providers**.

2. **Email provider**:
   - Ensure **Email** is enabled.
   - Keep **Confirm email** enabled.

3. **Google provider**:
   - Enable **Google**.
   - Enter the **OAuth Client ID** and **Client Secret** from Google Cloud Console.

4. **URL Configuration**:
   - Go to **Authentication** → **URL Configuration**.
   - **Site URL**:
     - Local: `http://localhost:3000`
     - Production: `https://YOUR_PRODUCTION_DOMAIN`
   - **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `https://YOUR_PRODUCTION_DOMAIN/auth/callback`

---

## Google Cloud Configuration

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Go to **APIs & Services** → **OAuth consent screen**.
4. Configure the consent screen (External or Internal as appropriate).
5. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**.
6. Select **Web application**.
7. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://YOUR_PRODUCTION_DOMAIN`
8. **Authorized redirect URIs** (this is the Supabase callback URL, **not** your Next.js route):
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Find your project ref in the Supabase dashboard URL: `https://supabase.com/dashboard/project/<PROJECT_REF>`
9. Copy the **Client ID** and **Client Secret** into Supabase (step 3 above).

> **Important**: Google redirects to Supabase first. Supabase then redirects to your Next.js `/auth/callback`. Do not add `http://localhost:3000/auth/callback` as a Google redirect URI.

---

## Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are found in Supabase Dashboard → **Settings** → **API**.
- `NEXT_PUBLIC_API_BASE_URL` points to the FastAPI backend.

---

## Manual Testing Notes

- Old email verification links generated before the cookie-client migration may fail. Use a **new account** or **resend the verification email**.
- Google OAuth does not require email verification — users are signed in immediately after authorizing.
- Password users must verify their email before their first login.