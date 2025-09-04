// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get status color for UI
const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Approved': 'info',
    'Resolved': 'success',
    'Rejected': 'danger'
  };
  return colors[status] || 'secondary';
};

// Get category color for UI
const getCategoryColor = (category) => {
  const colors = {
    'Food Issues': 'danger',
    'Leave Permission': 'info',
    'Teaching Issues': 'warning',
    'Others': 'secondary'
  };
  return colors[category] || 'primary';
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Pagination helper
const createPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
    total,
    limit
  };
};

// Sanitize string input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  formatDate,
  getStatusColor,
  getCategoryColor,
  isValidEmail,
  generateRandomString,
  createPagination,
  sanitizeInput
};
