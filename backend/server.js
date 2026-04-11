require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:8080',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any Vercel domain or explicitly allowed origins
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`🚫 CORS Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/analysis', analysisRoutes);
app.use('/roadmap', roadmapRoutes);

// Health check
app.get('/', (req, res) => {
  const geminiStatus = process.env.GEMINI_API_KEY 
    ? `Configured 🔑 (${process.env.GEMINI_API_KEY.substring(0, 6)}...)` 
    : 'Missing ❌';

  res.json({ 
    status: 'CareerCompass Backend v3.0 - LIVE',
    deploy_check: 'JSON_COMPATIBILITY_MODE_ACTIVE',
    database: mongoose.connection.readyState === 1 ? 'Healthy ✅' : 'Disconnected ❌',
    gemini_ai: geminiStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Database & Port Config
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/skill-navigator";

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  const FINAL_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!FINAL_URI) {
    console.warn('❌ ERROR: No MONGO_URI found in environment variables!');
    return;
  }

  // Extract username for verification
  const userMatch = FINAL_URI.match(/\/\/([^:]+):/);
  const username = userMatch ? userMatch[1] : 'unknown';
  const maskedUri = FINAL_URI.replace(/:([^@/]+)@/, ':****@');
  
  console.log(`🔗 Connecting as user: [${username}]`);
  console.log(`🔗 URI Structure: ${maskedUri}`);

  // Basic connection with simplified options
  mongoose
    .connect(FINAL_URI) 
    .then(() => {
      console.log('✅ Connected to MongoDB Successfully');
      console.log(`📡 Database Name: ${mongoose.connection.name}`);
    })
    .catch((err) => {
      console.error('❌ Connection Failed. Details:');
      console.error('   Message:', err.message);
      console.error('   Code Name:', err.codeName || 'N/A');
      console.error('   Full Error:', JSON.stringify(err).substring(0, 100));
      console.log('💡 TIP: If username is correct, the password must be wrong or contain bad characters.');
    });
});
