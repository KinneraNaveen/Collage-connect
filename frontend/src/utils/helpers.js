import moment from 'moment';

export const formatDate = (date) => {
  return moment(date).format('MMM DD, YYYY');
};

export const formatDateTime = (date) => {
  return moment(date).format('MMM DD, YYYY h:mm A');
};

export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Approved': 'info',
    'Resolved': 'success',
    'Rejected': 'danger'
  };
  return colors[status] || 'secondary';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Academic': 'primary',
    'Technical': 'info',
    'Facility': 'warning',
    'Administrative': 'secondary',
    'Other': 'dark'
  };
  return colors[category] || 'primary';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRegistrationNumber = (regNumber) => {
  const re = /^[A-Za-z0-9]{6,15}$/;
  return re.test(regNumber);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[\d\s\-()]{10,15}$/;
  return re.test(phone);
};
