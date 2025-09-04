const express = require('express');
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getMyIssues,
  getIssue,
  updateIssueStatus,
  getIssueStats
} = require('../controllers/issueController');
const { issueValidation } = require('../middleware/validation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/issues
// @desc    Create new issue
// @access  Private (Students only)
router.post('/', auth, issueValidation, createIssue);

// @route   GET /api/issues
// @desc    Get all issues (Admin only)
// @access  Private (Admin only)
router.get('/', auth, admin, getAllIssues);

// @route   GET /api/issues/my-issues
// @desc    Get user's issues
// @access  Private
router.get('/my-issues', auth, getMyIssues);

// @route   GET /api/issues/stats
// @desc    Get issue statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats', auth, admin, getIssueStats);

// @route   GET /api/issues/:id
// @desc    Get single issue
// @access  Private
router.get('/:id', auth, getIssue);

// @route   PUT /api/issues/:id
// @desc    Update issue status (Admin only)
// @access  Private (Admin only)
router.put('/:id', auth, admin, updateIssueStatus);

module.exports = router;
