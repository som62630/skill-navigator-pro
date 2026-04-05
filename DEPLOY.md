# 🚀 Deployment Guide - Skill Navigator Pro

This guide explains how to deploy your backend to Render or Railway and connect it to your Vercel frontend.

## 1. Prepare Backend for Deployment

The backend is already configured with:
- `Procfile` for platform detection.
- `engines` in `package.json` for Node.js versioning.
- Environment-aware CORS in `server.js`.

### Environment Variables
You will need to set these in your hosting dashboard (Render/Railway):
- `MONGO_URI`: Your MongoDB Atlas connection string.
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `JWT_SECRET`: A long random string for auth security.
- `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://skill-navigator.vercel.app`).
- `PORT`: `5001` (usually set automatically by the platform).

---

## 2. Deploying to Render (Recommended)
1. Go to [Render](https://render.com/) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or leave empty if using `package.json` start)
4. Add the **Environment Variables** listed above.
5. Click **Deploy**.

---

## 3. Deploying to Railway
1. Go to [Railway](https://railway.app/) and create a **New Project**.
2. Select **Deploy from GitHub repo**.
3. Choose your repository.
4. Settings:
   - **Root Directory**: `/backend`
5. Add the **Environment Variables**.
6. Railway will automatically detect the `Procfile` or `package.json` and deploy.

---

## 4. Connecting Frontend (Vercel)
1. Go to your **Vercel Dashboard**.
2. Navigate to **Settings > Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your newly deployed backend URL (e.g., `https://your-backend.onrender.com`)
4. **Redeploy** your frontend to apply the changes.

---

## ✅ Deployment Checklist
- [ ] MongoDB Atlas allows access from "0.0.0.0/0" or the platform's IP range.
- [ ] `FRONTEND_URL` in backend exactly matches the Vercel URL (including `https://`).
- [ ] `VITE_API_URL` in Vercel exactly matches the backend URL.
