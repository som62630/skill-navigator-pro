const Analysis = require('../models/Analysis');
const aiService = require('../services/aiService');
const pdf = require('pdf-parse');

exports.analyzeResume = async (req, res) => {
  try {
    const { name, role, level } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const dataBuffer = req.file.buffer;
    let resumeText = "";
    
    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(dataBuffer);
      resumeText = data.text;
    } else {
      // Support for future text-based files
      resumeText = dataBuffer.toString("utf-8");
    }

    if (!resumeText) return res.status(400).json({ message: "Could not extract text from file." });

    const analysisResults = await aiService.analyzeResume(resumeText, role, level);

    const savedAnalysis = await Analysis.create({
      userId: req.user.id,
      name,
      role,
      level,
      ...analysisResults,
    });

    res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required." });

    const aiResponse = await aiService.chat(message, history);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
