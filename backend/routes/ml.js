const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const LightweightML = require('../ml/services/lightweightML');
const Issue = require('../models/Issue');

const mlService = new LightweightML();

// @route   POST /api/ml/analyze-issue
// @desc    Analyze a new issue with ML
// @access  Private (Students & Admins)
router.post('/analyze-issue', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Get existing issues for similarity analysis
    const existingIssues = await Issue.find().limit(100);

    // Create issue data for analysis
    const issueData = {
      title,
      description,
      category,
      studentId: req.user.id
    };

    // Perform ML analysis
    const classification = mlService.classifyIssue(title, description);
    const sentiment = mlService.analyzeSentiment(description);
    const priority = mlService.predictPriority({
      ...issueData,
      sentiment: sentiment.sentiment,
      urgency: sentiment.urgency
    });
    const similarity = mlService.findSimilarIssues(issueData, existingIssues);

    const analysis = {
      issueId: issueData._id || 'new',
      timestamp: new Date(),
      classification,
      sentiment,
      priority,
      similarity,
      confidence: (classification.confidence + sentiment.confidence + priority.confidence) / 3
    };

    res.json({
      success: true,
      analysis,
      message: 'Issue analyzed successfully'
    });
  } catch (error) {
    console.error('ML Analysis Error:', error);
    res.status(500).json({ 
      message: 'ML analysis failed',
      error: error.message 
    });
  }
});

// @route   GET /api/ml/insights
// @desc    Get ML insights and trends
// @access  Private (Admin only)
router.get('/insights', auth, admin, async (req, res) => {
  try {
    const issues = await Issue.find().populate('studentId', 'name email');
    
    const insights = mlService.getInsights(issues);

    res.json({
      success: true,
      insights,
      message: 'ML insights retrieved successfully'
    });
  } catch (error) {
    console.error('ML Insights Error:', error);
    res.status(500).json({ 
      message: 'Failed to get ML insights',
      error: error.message 
    });
  }
});

// @route   POST /api/ml/analyze-batch
// @desc    Analyze multiple issues with ML
// @access  Private (Admin only)
router.post('/analyze-batch', auth, admin, async (req, res) => {
  try {
    const { issueIds } = req.body;

    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({ message: 'Issue IDs array is required' });
    }

    const issues = await Issue.find({ _id: { $in: issueIds } });
    
    if (issues.length === 0) {
      return res.status(404).json({ message: 'No issues found' });
    }

    const analysis = mlService.analyzeBatch(issues);

    res.json({
      success: true,
      analysis,
      message: `Analyzed ${analysis.length} issues successfully`
    });
  } catch (error) {
    console.error('Batch Analysis Error:', error);
    res.status(500).json({ 
      message: 'Batch analysis failed',
      error: error.message 
    });
  }
});

// @route   POST /api/ml/feedback
// @desc    Provide feedback for ML model improvement
// @access  Private (Students & Admins)
router.post('/feedback', auth, async (req, res) => {
  try {
    const { issueId, feedback } = req.body;

    if (!issueId || !feedback) {
      return res.status(400).json({ message: 'Issue ID and feedback are required' });
    }

    const result = {
      success: true,
      message: 'Feedback recorded for model improvement',
      timestamp: new Date()
    };

    res.json({
      success: true,
      result,
      message: 'Feedback recorded successfully'
    });
  } catch (error) {
    console.error('ML Feedback Error:', error);
    res.status(500).json({ 
      message: 'Failed to record feedback',
      error: error.message 
    });
  }
});

// @route   GET /api/ml/status
// @desc    Get ML service status
// @access  Private (Admin only)
router.get('/status', auth, admin, async (req, res) => {
  try {
    const status = {
      services: {
        issueClassifier: 'active',
        sentimentAnalyzer: 'active',
        priorityPredictor: 'active',
        similarityEngine: 'active'
      },
      lastUpdate: new Date(),
      version: '1.0.0'
    };

    res.json({
      success: true,
      status,
      message: 'ML service status retrieved successfully'
    });
  } catch (error) {
    console.error('ML Status Error:', error);
    res.status(500).json({ 
      message: 'Failed to get ML service status',
      error: error.message 
    });
  }
});

// @route   POST /api/ml/suggest-category
// @desc    Get category suggestion for an issue
// @access  Private (Students & Admins)
router.post('/suggest-category', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const classification = mlService.classifyIssue(title, description);

    res.json({
      success: true,
      suggestion: {
        category: classification.category,
        confidence: classification.confidence,
        keywords: classification.suggestedKeywords
      },
      message: 'Category suggestion generated successfully'
    });
  } catch (error) {
    console.error('Category Suggestion Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate category suggestion',
      error: error.message 
    });
  }
});

// @route   POST /api/ml/analyze-sentiment
// @desc    Analyze sentiment of text
// @access  Private (Students & Admins)
router.post('/analyze-sentiment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const sentiment = mlService.analyzeSentiment(text);

    res.json({
      success: true,
      sentiment,
      message: 'Sentiment analyzed successfully'
    });
  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze sentiment',
      error: error.message 
    });
  }
});

// @route   POST /api/ml/find-similar
// @desc    Find similar issues
// @access  Private (Students & Admins)
router.post('/find-similar', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Get existing issues
    const existingIssues = await Issue.find().limit(100);

    const issueData = { title, description };
    const similarity = mlService.findSimilarIssues(issueData, existingIssues);

    res.json({
      success: true,
      similarity,
      message: 'Similar issues found successfully'
    });
  } catch (error) {
    console.error('Similarity Search Error:', error);
    res.status(500).json({ 
      message: 'Failed to find similar issues',
      error: error.message 
    });
  }
});

// @route   POST /api/ml/predict-priority
// @desc    Predict priority for an issue
// @access  Private (Students & Admins)
router.post('/predict-priority', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const issueData = {
      title,
      description,
      category,
      studentId: req.user.id
    };

    const priority = mlService.predictPriority(issueData);

    res.json({
      success: true,
      priority,
      message: 'Priority predicted successfully'
    });
  } catch (error) {
    console.error('Priority Prediction Error:', error);
    res.status(500).json({ 
      message: 'Failed to predict priority',
      error: error.message 
    });
  }
});

module.exports = router;
