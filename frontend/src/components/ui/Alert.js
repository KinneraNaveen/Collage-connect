import React from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose, show = true }) => {
  if (!show) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      <div className="alert-content">
        <i className={`bi bi-${getAlertIcon(type)} me-2`}></i>
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

const getAlertIcon = (type) => {
  const icons = {
    success: 'check-circle',
    danger: 'exclamation-triangle',
    warning: 'exclamation-circle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
};

export default Alert;
