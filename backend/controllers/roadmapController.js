const Roadmap = require('../models/Roadmap');
const aiService = require('../services/aiService');

exports.generateRoadmap = async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ message: "Goal is required." });

    const roadmapData = await aiService.generateRoadmap(goal);
    res.json(roadmapData);
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.saveRoadmap = async (req, res) => {
  try {
    const { goal, summary, estimatedWeeks, categories, timeline } = req.body;
    if (!goal) return res.status(400).json({ message: "Goal is required." });

    const saved = await Roadmap.create({
      userId: req.user.id,
      goal,
      summary,
      estimatedWeeks,
      categories,
      timeline,
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error("Save Roadmap Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('goal estimatedWeeks categories.name categories.overallProgress categories.skills createdAt');
    
    const formatted = roadmaps.map(rm => ({
      id: rm._id,
      goal: rm.goal,
      weeks: rm.estimatedWeeks,
      skills: rm.categories.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0),
      progress: Math.round(
        rm.categories.reduce((acc, cat) => acc + (cat.overallProgress || 0), 0) / 
        Math.max(rm.categories.length, 1)
      ),
      createdAt: rm.createdAt.toISOString().split('T')[0],
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { roadmapId, categoryIndex, skillIndex, progress } = req.body;
    
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found." });

    if (roadmap.categories[categoryIndex] && roadmap.categories[categoryIndex].skills[skillIndex]) {
      roadmap.categories[categoryIndex].skills[skillIndex].progress = progress;
      
      // Recalculate category progress
      const cat = roadmap.categories[categoryIndex];
      cat.overallProgress = Math.round(
        cat.skills.reduce((acc, s) => acc + s.progress, 0) / cat.skills.length
      );
      
      await roadmap.save();
      res.json(roadmap);
    } else {
      res.status(400).json({ message: "Invalid category or skill index." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
