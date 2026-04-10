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
  
  // Choose the right variable (some people name it MONGODB_URI by mistake)
  const FINAL_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!FINAL_URI || FINAL_URI.includes('localhost')) {
    console.warn('⚠️ WARNING: No cloud MONGO_URI found. Check your Render Environment tab.');
  }

  // Extract username for verification (without password)
  const userMatch = FINAL_URI ? FINAL_URI.match(/\/\/([^:]+):/) : null;
  const username = userMatch ? userMatch[1] : 'unknown';
  
  // Mask password for logging
  const maskedUri = FINAL_URI ? FINAL_URI.replace(/:([^@]+)@/, ':****@') : 'none';
  
  console.log(`🔗 Connecting as user: [${username}]`);
  console.log(`🔗 URI Structure: ${maskedUri}`);

  mongoose
    .connect(FINAL_URI || MONGO_URI, {
      authSource: 'admin', // Force authentication against the admin database
    })
    .then(() => console.log('✅ Connected to MongoDB Successfully'))
    .catch((err) => {
      console.error('❌ MongoDB Connection Error Details:');
      console.error('   Message:', err.message);
      console.error('   Code:', err.code);
      console.log('💡 TIP: If username is correct, reset the password for that user in Atlas with NO special characters.');
    });
});
