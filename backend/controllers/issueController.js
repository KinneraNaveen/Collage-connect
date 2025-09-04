const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private (Students only)
const createIssue = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const issue = new Issue({
      title,
      description,
      category,
      studentId: req.user._id
    });

    await issue.save();

    res.status(201).json({
      message: 'Issue submitted successfully',
      issue
    });

  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all issues (for admin)
// @route   GET /api/issues
// @access  Private (Admin only)
const getAllIssues = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const issues = await Issue.find(filter)
      .populate('studentId', 'name registrationNumber email')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get all issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's issues
// @route   GET /api/issues/my-issues
// @access  Private
const getMyIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const issues = await Issue.find({ studentId: req.user._id })
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments({ studentId: req.user._id });

    res.json({ 
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get my issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('studentId', 'name registrationNumber email')
      .populate('resolvedBy', 'name');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user can access this issue
    if (req.user.role === 'student' && issue.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ issue });

  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update issue status (Admin only)
// @route   PUT /api/issues/:id
// @access  Private (Admin only)
const updateIssueStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = status;
    if (adminComment) issue.adminComment = adminComment;
    
    if (status === 'Resolved') {
      issue.resolvedBy = req.user._id;
    } else {
      issue.resolvedBy = undefined;
    }

    await issue.save();

    res.json({
      message: 'Issue status updated successfully',
      issue
    });

  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get issue statistics
// @route   GET /api/issues/stats
// @access  Private (Admin only)
const getIssueStats = async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      categoryStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getMyIssues,
  getIssue,
  updateIssueStatus,
  getIssueStats
};
