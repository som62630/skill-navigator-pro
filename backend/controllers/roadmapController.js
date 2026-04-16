const Roadmap = require('../models/Roadmap');
const aiService = require('../services/aiService');

function buildFallbackRoadmap(goal) {
  return {
    goal,
    summary: `A practical roadmap to help you become a ${goal}.`,
    estimatedWeeks: 12,
    categories: [
      {
        name: "Core Foundations",
        icon: "Code2",
        color: "text-primary",
        overallProgress: 0,
        skills: [
          { name: "Fundamentals", description: "Learn the core concepts and terminology.", difficulty: "Beginner", estimatedHours: 10, progress: 0, resources: [] },
          { name: "Hands-on Practice", description: "Apply concepts through small projects.", difficulty: "Intermediate", estimatedHours: 12, progress: 0, resources: [] },
        ]
      },
      {
        name: "Tools & Workflow",
        icon: "Settings",
        color: "text-secondary",
        overallProgress: 0,
        skills: [
          { name: "Industry Tools", description: "Get comfortable with common tooling.", difficulty: "Beginner", estimatedHours: 8, progress: 0, resources: [] },
          { name: "Portfolio Building", description: "Showcase your work and progress.", difficulty: "Intermediate", estimatedHours: 10, progress: 0, resources: [] },
        ]
      }
    ],
    timeline: [
      { week: "Week 1-2", title: "Foundation", tasks: ["Learn basics", "Set learning schedule", "Complete first exercises"], completed: false },
      { week: "Week 3-6", title: "Build Momentum", tasks: ["Practice consistently", "Finish 1-2 mini projects", "Review weak areas"], completed: false },
      { week: "Week 7-12", title: "Job-Ready Skills", tasks: ["Create portfolio-ready project", "Refine problem solving", "Prepare for interviews"], completed: false },
    ],
  };
}

exports.generateRoadmap = async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ message: "Goal is required." });

    let roadmapData;
    try {
      roadmapData = await aiService.generateRoadmap(goal);
    } catch (aiError) {
      console.warn("Roadmap AI unavailable, serving fallback roadmap:", aiError.message);
      roadmapData = buildFallbackRoadmap(goal);
    }

    // Defensive validation & defaults
    if (!roadmapData) throw new Error("AI failed to generate roadmap data");
    
    // Ensure basic structure exists
    roadmapData.goal = roadmapData.goal || goal;
    roadmapData.summary = roadmapData.summary || `A comprehensive guide to becoming a ${goal}.`;
    roadmapData.estimatedWeeks = roadmapData.estimatedWeeks || 12;
    roadmapData.categories = roadmapData.categories || [];
    roadmapData.timeline = roadmapData.timeline || [];

    // Ensure categories have skills as objects
    roadmapData.categories = roadmapData.categories.map(cat => ({
      ...cat,
      name: cat.name || "General Skills",
      icon: cat.icon || "Code2",
      color: cat.color || "text-primary",
      overallProgress: cat.overallProgress || 0,
      skills: (cat.skills || []).map(skill => (
        typeof skill === 'string' 
          ? { name: skill, description: "Learn this core skill", difficulty: "Intermediate", estimatedHours: 5, progress: 0, resources: [] }
          : {
              name: skill.name || "Unnamed Skill",
              description: skill.description || "Skill details coming soon",
              difficulty: skill.difficulty || "Intermediate",
              estimatedHours: skill.estimatedHours || 5,
              progress: skill.progress || 0,
              resources: skill.resources || []
            }
      ))
    }));

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
