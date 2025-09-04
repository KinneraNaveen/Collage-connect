const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// User login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Issue creation validation
const issueValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['Academic', 'Technical', 'Facility', 'Administrative', 'Other'])
    .withMessage('Please select a valid category'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  issueValidation,
  handleValidationErrors
};
