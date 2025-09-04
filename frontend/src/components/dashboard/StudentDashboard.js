import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ISSUE_CATEGORIES } from '../../utils/constants';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import api from '../../utils/api';
import IssueList from '../issues/IssueList';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalIssues, setTotalIssues] = useState(0);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async (page = 1) => {
    try {
      const response = await api.get(`/issues/my-issues?page=${page}&limit=${itemsPerPage}`);
      setIssues(response.data.issues);
      setTotalIssues(response.data.total || response.data.issues.length);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Debug: Check user authentication
    console.log('Current user:', user);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    
    setSubmitting(true);
    
    try {
      const response = await api.post('/issues', formData);
      console.log('Issue submitted successfully:', response.data);
      
      // Clear form and show success message
      setFormData({ title: '', description: '', category: '' });
      setShowForm(false);
      setFormErrors({});
      
      // Show success message
      alert('Issue submitted successfully!');
      
      // Refresh the issues list
      fetchIssues();
    } catch (error) {
      console.error('Error submitting issue:', error);
      console.error('Error response:', error.response);
      
      // Show error message to user
      const errorMessage = error.response?.data?.message || 'Failed to submit issue. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusCount = useCallback((status) => {
    return issues.filter(issue => issue.status === status).length;
  }, [issues]);

  const handleViewIssue = useCallback((issue) => {
    setSelectedIssue(issue);
    setShowIssueModal(true);
  }, []);

  const closeIssueModal = () => {
    setShowIssueModal(false);
    setSelectedIssue(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchIssues(pageNumber);
  };

  const totalPages = Math.ceil(totalIssues / itemsPerPage);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="dashboard-title">
                <i className="bi bi-speedometer2 me-2"></i>
                Student Dashboard
              </h1>
              <p className="text-muted">Welcome back, {user.name}!</p>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                {showForm ? 'Cancel' : 'Submit New Issue'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-primary">
                <i className="bi bi-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{getStatusCount('Pending')}</h3>
                <p>Pending</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-info">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{getStatusCount('Approved')}</h3>
                <p>Approved</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-success">
                <i className="bi bi-check2-all"></i>
              </div>
              <div className="stat-content">
                <h3>{getStatusCount('Resolved')}</h3>
                <p>Resolved</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-danger">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{getStatusCount('Rejected')}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Issue Form */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Submit New Issue
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Issue Title</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        placeholder="Enter issue title"
                        disabled={submitting}
                      />
                      {formErrors.title && (
                        <div className="invalid-feedback">{formErrors.title}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Category</label>
                      <select
                        className={`form-select ${formErrors.category ? 'is-invalid' : ''}`}
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        disabled={submitting}
                      >
                        <option value="">Select category</option>
                        {ISSUE_CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {formErrors.category && (
                        <div className="invalid-feedback">{formErrors.category}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe your issue in detail"
                    disabled={submitting}
                  ></textarea>
                  {formErrors.description && (
                    <div className="invalid-feedback">{formErrors.description}</div>
                  )}
                </div>
                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Submit Issue
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Issues List */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              My Issues
            </h5>
          </div>
          <div className="card-body">
            {issues.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h5 className="mt-3">No issues submitted yet</h5>
                <p className="text-muted">Submit your first issue to get started</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Submit Issue
                </button>
              </div>
                         ) : (
               <IssueList 
                 issues={issues} 
                 onViewIssue={handleViewIssue} 
                 loading={loading}
               />
             )}

             {/* Pagination */}
             {totalPages > 1 && (
               <div className="d-flex justify-content-center mt-4">
                 <nav aria-label="Issues pagination">
                   <ul className="pagination">
                     <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                       <button
                         className="page-link"
                         onClick={() => handlePageChange(currentPage - 1)}
                         disabled={currentPage === 1}
                       >
                         Previous
                       </button>
                     </li>
                     
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                       <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                         <button
                           className="page-link"
                           onClick={() => handlePageChange(page)}
                         >
                           {page}
                         </button>
                       </li>
                     ))}
                     
                     <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                       <button
                         className="page-link"
                         onClick={() => handlePageChange(currentPage + 1)}
                         disabled={currentPage === totalPages}
                       >
                         Next
                       </button>
                     </li>
                   </ul>
                 </nav>
               </div>
             )}
           </div>
         </div>

        {/* Issue Details Modal */}
        {showIssueModal && selectedIssue && (
          <div className="modal-overlay" onClick={closeIssueModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Issue Details</h5>
                <button type="button" className="btn-close" onClick={closeIssueModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Issue Information</h6>
                    <p><strong>Title:</strong> {selectedIssue.title}</p>
                    <p><strong>Category:</strong> {selectedIssue.category}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge bg-${getStatusColor(selectedIssue.status)} ms-2`}>
                        {selectedIssue.status}
                      </span>
                    </p>
                    <p><strong>Submitted:</strong> {formatDateTime(selectedIssue.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Description</h6>
                    <p>{selectedIssue.description}</p>
                  </div>
                </div>
                
                {/* Admin Comment Section */}
                {selectedIssue.adminComment && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="alert alert-info">
                        <h6 className="alert-heading">
                          <i className="bi bi-chat-dots me-2"></i>
                          Admin Response
                        </h6>
                        <p className="mb-0">{selectedIssue.adminComment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeIssueModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
