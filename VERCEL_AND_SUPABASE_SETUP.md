# Authentication, Vercel & Supabase Deployment Guide

> **Course Evaluation Details for ENTR 3360**  
> This document details the authentication setup, test account credentials, and deployment configuration for Vercel and Supabase.

---

## 1. Test Account Credentials for Course Reviewer / Grader

You can sign in immediately using these pre-configured test credentials without creating a new account:

* **Email:** `reviewer@careercompass.edu`
* **Password:** `Reviewer2026!Demo`
* **One-Click Quick Login:** In the app, click **"Sign in"** in the top navigation, and click the **"⚡ 1-Click Login"** button in the green test banner.

---

## 2. Authentication Features & Behavior

1. **Create an Account (Sign Up):**
   * Visitors can click **Sign in** → **Create Account** tab.
   * Enter name, email, and any password (minimum 6 characters).
   * Account is created and user is signed in immediately.

2. **Sign In & Sign Out:**
   * Enter email and password or use the 1-click test account.
   * Sign out anytime by clicking your avatar in the top right → **Sign out**.

3. **Persistent Session Across Page Refresh:**
   * Auth state is automatically persisted in browser storage (`localStorage` and Supabase JWT session).
   * Refreshing the page (Cmd+R / F5) keeps the user securely logged in.

4. **Screen that Behaves Differently (Protected Private Records):**
   * Navigate to **"My Records"** (`/saved`) in the top navigation:
     * **When Signed Out:** Displays an **"Account Required"** screen explaining that saved records are private, with a prompt to sign in or use the test account.
     * **When Signed In:** Displays **only that person's own records**:
       * Private saved career bookmarks.
       * Interactive **Personal Reflection Notes** for each career (add, edit, and save notes).
       * Personalized assessment archetype and trait summary.

---

## 3. Configuring Supabase for Vercel Deployment

To ensure authentication works on your live Vercel URL:

### Step 1: Set Site URL & Redirect URLs in Supabase
1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.
2. In the left menu, navigate to **Authentication** → **URL Configuration**.
3. Under **Site URL**, paste your Vercel production URL:
   ```
   https://your-app-name.vercel.app
   ```
4. Under **Redirect URLs**, add the following URLs (click **Add URL**):
   ```
   https://your-app-name.vercel.app/**
   http://localhost:3000/**
   ```
5. Click **Save**.

### Step 2: (Optional but Recommended) Disable Email Confirmation for Instant Testing
1. In Supabase Dashboard, go to **Authentication** → **Providers** → **Email**.
2. Toggle **"Confirm email"** to **OFF** (Disabled).
3. Click **Save**.  
   *(This allows you and your professor to create accounts and log in immediately without waiting for confirmation emails).*

---

## 4. Setting Environment Variables in Vercel

1. Open your **[Vercel Dashboard](https://vercel.com/dashboard)** and click on your project.
2. Navigate to **Settings** → **Environment Variables**.
3. Add the following two variables:

| Key | Where to find in Supabase | Value Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase **Project Settings** → **API** → **Project URL** | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **Project Settings** → **API** → **Project API Keys (`anon public`)** | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |

4. Check **Production**, **Preview**, and **Development** environments.
5. Click **Save**.
6. Redeploy your project on Vercel (or push a new commit) for the environment variables to take effect.
