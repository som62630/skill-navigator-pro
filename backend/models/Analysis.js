const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  level: { type: String, required: true },
  score: { type: Number, required: true },
  strengths: [String],
  weaknesses: [String],
  missing: [String],
  suggested: [String],
  roadmap: [
    {
      week: String,
      title: String,
      tasks: [String],
    },
  ],
  projects: [
    {
      title: String,
      desc: String,
      difficulty: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', analysisSchema);
