const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: String,
  description: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  estimatedHours: Number,
  progress: { type: Number, default: 0 },
  resources: [String],
});

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  color: String,
  skills: [skillSchema],
  overallProgress: { type: Number, default: 0 },
});

const timelineSchema = new mongoose.Schema({
  week: String,
  title: String,
  tasks: [String],
  completed: { type: Boolean, default: false },
});

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, required: true },
  summary: String,
  estimatedWeeks: Number,
  categories: [categorySchema],
  timeline: [timelineSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
