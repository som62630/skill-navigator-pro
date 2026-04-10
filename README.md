# 🧭 CareerCompass

**AI-powered career intelligence platform.** CareerCompass helps you find the exact skills you need to land your dream job by generating personalized week-by-week roadmaps, curating learning resources, and tracking your progress.

![CareerCompass Dashboard](/public/images/dashboard-hero.png)

## 🚀 Features

- **AI Roadmap Generator**: Enter any career goal and get a structured, time-based learning path.
- **Resume Analysis**: Upload your resume to get a readiness score and identified skill gaps.
- **AI Career Coach**: Chat with an expert AI coach for personalized career advice.
- **Progress Tracking**: Visualize your learning journey and mark skills as complete.
- **Curated Resources**: Every skill comes with recommended high-quality learning materials.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js (Express), MongoDB (Mongoose), Google Gemini 1.5 Pro.
- **Deployment**: Vercel (Frontend), Render (Backend).

## 📁 Project Structure

```text
├── backend/            # Express server (Node.js)
├── src/                # React frontend source
├── public/             # Static assets (images, icons)
├── render.yaml         # Render Blueprint for backend deployment
├── vercel.json         # Vercel configuration for frontend
└── .env.example        # Template for environment variables
```

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/som62630/skill-navigator-pro.git
cd skill-navigator-pro
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 3. Environment Variables
Create a `.env` file in the root and add:
```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_API_URL=http://localhost:5001
```

Create a `.env` file in the `backend/` directory and add:
```env
GEMINI_API_KEY=your_gemini_key
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

### 4. Run Locally
```bash
# Start backend (from /backend folder)
npm run dev

# Start frontend (from root folder)
npm run dev
```

## 🌍 Deployment

### Backend (Render)
1. Use the **Blueprint** feature on Render.
2. Select the `render.yaml` in the `backend/` directory.
3. Configure `MONGO_URI` and `GEMINI_API_KEY` in the Render dashboard.

### Frontend (Vercel)
1. Import the repository to Vercel.
2. Add `VITE_API_URL` pointing to your Render backend URL.
3. Add `VITE_GEMINI_API_KEY` (optional fallback).

## 📄 License
This project is licensed under the MIT License.
