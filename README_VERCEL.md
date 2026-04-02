# Vercel Deployment Guide - AI Coach Fix

To ensure the AI Career Coach works permanently on your Vercel deployment, follow these simple steps to add your Gemini API Key.

### 1. Get your Gemini API Key
If you don't have one, get it from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Add the Environment Variable to Vercel
1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your-api-key-here` (Starts with AIza...)
4. Click **Save**.

### 3. Redeploy
Vercel will automatically pick up the new environment variable for the backend function (`/api/chat.ts`). If it doesn't work immediately, go to the **Deployments** tab and select **Redeploy** on the latest build.

---

### Why this fix is better:
- **Security**: Your API key is now hidden in the backend and never exposed to the browser.
- **Robustness**: The app now has a "Local Brain" fallback that kicks in automatically if the API is unavailable or the key is missing, ensuring a smooth experience for all users.
