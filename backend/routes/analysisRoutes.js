const express = require('express');
const multer = require('multer');
const { analyzeResume, getHistory, chat } = require('../controllers/analysisController');
const protect = require('../middleware/auth');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/process', protect, upload.single('file'), analyzeResume);
router.get('/history', protect, getHistory);
router.post('/chat', protect, chat);

module.exports = router;
