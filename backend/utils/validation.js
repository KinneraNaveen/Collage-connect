const { body, param, query } = require('express-validator');

// Custom validation for registration number (alphanumeric, 6-15 characters)
const isValidRegistrationNumber = (value) => {
  const regNumberRegex = /^[A-Za-z0-9]{6,15}$/;
  if (!regNumberRegex.test(value)) {
    throw new Error('Registration number must be 6-15 characters, alphanumeric only');
  }
  return true;
};

// Custom validation for phone number
const isValidPhoneNumber = (value) => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  if (!phoneRegex.test(value)) {
    throw new Error('Please enter a valid phone number');
  }
  return true;
};

// Enhanced registration validation
const enhancedRegisterValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('registrationNumber')
    .custom(isValidRegistrationNumber),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('phone')
    .custom(isValidPhoneNumber),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Enhanced issue validation
const enhancedIssueValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn(['Food Issues', 'Leave Permission', 'Teaching Issues', 'Others'])
    .withMessage('Please select a valid category')
];

// Pagination validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

// ID validation for MongoDB ObjectId
const isValidObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

// Search validation
const searchValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search term must be at least 2 characters')
];

module.exports = {
  enhancedRegisterValidation,
  enhancedIssueValidation,
  paginationValidation,
  isValidObjectId,
  searchValidation,
  isValidRegistrationNumber,
  isValidPhoneNumber
};
