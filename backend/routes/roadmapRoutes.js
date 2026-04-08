const express = require('express');
const { generateRoadmap, saveRoadmap, getUserRoadmaps, updateProgress } = require('../controllers/roadmapController');
const protect = require('../middleware/auth');
const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.post('/save', protect, saveRoadmap);
router.get('/history', protect, getUserRoadmaps);
router.put('/progress', protect, updateProgress);

module.exports = router;
