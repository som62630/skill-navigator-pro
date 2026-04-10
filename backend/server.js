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
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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
  res.json({ 
    status: 'CareerCompass Backend is running',
    database: mongoose.connection.readyState === 1 ? 'Healthy ✅' : 'Disconnected ❌',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database & Port Config
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/skill-navigator";

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Database connection
  if (!MONGO_URI || MONGO_URI.includes('localhost')) {
    console.warn('⚠️ WARNING: Using local database connection string. Ensure MONGO_URI is set in environment.');
  }

  // Mask password for logging
  const maskedUri = MONGO_URI.replace(/:([^@]+)@/, (match, p1) => match.replace(p1, '****'));
  console.log(`🔗 Connecting to: ${maskedUri}`);

  mongoose
    .connect(MONGO_URI, {
      authSource: 'admin', // Force authentication against the admin database
    })
    .then(() => console.log('✅ Connected to MongoDB Successfully'))
    .catch((err) => {
      console.error('❌ MongoDB Connection Error Details:');
      console.error('   Message:', err.message);
      console.error('   Code:', err.code);
      console.log('💡 TIP: Check if your password contains special characters or if 0.0.0.0/0 is active in Atlas.');
    });
});
