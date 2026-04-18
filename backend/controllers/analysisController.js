const Analysis = require('../models/Analysis');
const aiService = require('../services/aiService');
const pdfParse = require('pdf-parse');

function getPdfParser() {
  if (typeof pdfParse === "function") return pdfParse;
  if (pdfParse && typeof pdfParse.default === "function") return pdfParse.default;
  if (pdfParse && typeof pdfParse.pdf === "function") return pdfParse.pdf;
  if (pdfParse && typeof pdfParse.PDFParse === "function") {
    return async (buffer) => {
      const parser = new pdfParse.PDFParse({ data: buffer });
      return parser.getText({ mergePages: true });
    };
  }
  throw new Error("PDF parser is not available on this server build.");
}

exports.analyzeResume = async (req, res) => {
  try {
    const { name, role, level } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const fileMimeType = req.file.mimetype || "";
    let resumeBufferForAi = req.file.buffer;
    let mimeTypeForAi = fileMimeType;

    if (fileMimeType === "application/pdf") {
      const pdf = getPdfParser();
      const parsedPdf = await pdf(req.file.buffer);
      const extractedText = (parsedPdf?.text || "").replace(/\s+/g, " ").trim();
      if (!extractedText || extractedText.length < 60) {
        return res.status(400).json({
          message: "Could not extract readable text from this PDF. Please upload a text-based PDF (not image-scanned)."
        });
      }
      resumeBufferForAi = Buffer.from(extractedText, "utf-8");
      mimeTypeForAi = "text/plain";
    } else if (
      fileMimeType === "application/msword" ||
      fileMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return res.status(400).json({
        message: "DOC/DOCX parsing is not enabled yet. Please upload your resume as a text-based PDF."
      });
    }

    const analysisResults = await aiService.analyzeResume(
      resumeBufferForAi,
      mimeTypeForAi,
      role,
      level
    );

    if (!analysisResults) return res.status(400).json({ message: "Could not analyze resume." });

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
