import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Dashboard.css';

const ISSUE_CATEGORIES = [
  'Academic', 'Technical', 'Facility', 'Administrative', 'Other'
];

const AdminDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { user: currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentData, setCommentData] = useState({
    issueId: '',
    status: '',
    comment: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesResponse] = await Promise.all([
        api.get('/issues')
      ]);
      
      setIssues(issuesResponse.data.issues || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId, status, adminComment = '') => {
    try {
      await api.put(`/issues/${issueId}`, { status, adminComment });
      fetchData();
      alert(`Issue status updated to ${status}`);
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Failed to update issue status');
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await api.put(`/issues/${commentData.issueId}`, { 
        status: commentData.status, 
        adminComment: commentData.comment 
      });
      fetchData();
      alert(`Issue status updated to ${commentData.status} with comment`);
      closeCommentModal();
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Failed to update issue status');
    }
  };

  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setShowIssueModal(true);
  };

  const closeModal = () => {
    setShowIssueModal(false);
    setSelectedIssue(null);
  };

  const openCommentModal = (issueId, status) => {
    setCommentData({
      issueId,
      status,
      comment: ''
    });
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setCommentData({
      issueId: '',
      status: '',
      comment: ''
    });
  };

  const filteredIssues = issues.filter(issue => {
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.category && issue.category !== filters.category) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description.toLowerCase().includes(searchTerm) ||
        issue.studentId?.name?.toLowerCase().includes(searchTerm) ||
        issue.studentId?.email?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }
    return true;
  });

  const getStatusCount = (status) => {
    return issues.filter(issue => issue.status === status).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'info';
      case 'Resolved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <i className="bi bi-shield-check me-2"></i>
                Admin Dashboard - User Requests
              </h1>
              <p className="text-muted">Manage all user issues and requests</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${filters.status === '' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilters({ ...filters, status: '' })}
                >
                  All Issues
                </button>
                <button
                  type="button"
                  className={`btn ${filters.status === 'Pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilters({ ...filters, status: 'Pending' })}
                >
                  Pending ({getStatusCount('Pending')})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-warning">
                <i className="bi bi-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{getStatusCount('Pending')}</h3>
                <p>Pending Requests</p>
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
                <p>Approved Requests</p>
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
                <p>Resolved Requests</p>
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
                <p>Rejected Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, description, or user..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {ISSUE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-1">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setFilters({ status: '', category: '', search: '' })}
                  title="Clear all filters"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Management */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              All User Requests ({filteredIssues.length})
            </h5>
          </div>
          <div className="card-body">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h5 className="mt-3">No issues found</h5>
                <p className="text-muted">No issues match the current filters</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User Details</th>
                      <th>Issue Information</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map(issue => (
                      <tr key={issue._id}>
                        <td>
                          <div className="user-info">
                            <strong>{issue.studentId?.name || 'Unknown User'}</strong>
                            <br />
                            <small className="text-muted">{issue.studentId?.email || 'No email'}</small>
                            <br />
                            <small className="text-muted">ID: {issue.studentId?.registrationNumber || 'N/A'}</small>
                          </div>
                        </td>
                        <td>
                          <div className="issue-info">
                            <strong>{issue.title}</strong>
                            <br />
                            <small className="text-muted">
                              {issue.description.length > 100 
                                ? `${issue.description.substring(0, 100)}...` 
                                : issue.description
                              }
                            </small>
                            <br />
                            <button
                              className="btn btn-link btn-sm p-0 mt-1"
                              onClick={() => handleViewIssue(issue)}
                            >
                              View Full Details
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{issue.category}</span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td>
                          <small>{formatDateTime(issue.createdAt)}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleViewIssue(issue)}
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {issue.status === 'Pending' && (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => openCommentModal(issue._id, 'Approved')}
                                  title="Approve with Comment"
                                >
                                  <i className="bi bi-check"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => openCommentModal(issue._id, 'Rejected')}
                                  title="Reject with Comment"
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </>
                            )}
                            {issue.status === 'Approved' && (
                              <button
                                className="btn btn-outline-success"
                                onClick={() => openCommentModal(issue._id, 'Resolved')}
                                title="Mark as Resolved with Comment"
                              >
                                <i className="bi bi-check2-all"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Issue Detail Modal */}
        {showIssueModal && selectedIssue && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Issue Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>User Information</h6>
                    <p><strong>Name:</strong> {selectedIssue.studentId?.name}</p>
                    <p><strong>Email:</strong> {selectedIssue.studentId?.email}</p>
                    <p><strong>Registration:</strong> {selectedIssue.studentId?.registrationNumber}</p>
                    <p><strong>Phone:</strong> {selectedIssue.studentId?.phone}</p>
                  </div>
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
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Description</h6>
                    <p>{selectedIssue.description}</p>
                  </div>
                </div>
                {selectedIssue.adminComment && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6>Admin Comment</h6>
                      <p>{selectedIssue.adminComment}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedIssue.status === 'Pending' && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        openCommentModal(selectedIssue._id, 'Approved');
                        closeModal();
                      }}
                    >
                      <i className="bi bi-check me-2"></i>Approve with Comment
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        openCommentModal(selectedIssue._id, 'Rejected');
                        closeModal();
                      }}
                    >
                      <i className="bi bi-x me-2"></i>Reject with Comment
                    </button>
                  </>
                )}
                {selectedIssue.status === 'Approved' && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      openCommentModal(selectedIssue._id, 'Resolved');
                      closeModal();
                    }}
                  >
                    <i className="bi bi-check2-all me-2"></i>Mark as Resolved with Comment
                  </button>
                )}
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        {showCommentModal && (
          <div className="modal-overlay" onClick={closeCommentModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {commentData.status === 'Approved' && 'Approve Issue'}
                  {commentData.status === 'Rejected' && 'Reject Issue'}
                  {commentData.status === 'Resolved' && 'Mark as Resolved'}
                </h5>
                <button type="button" className="btn-close" onClick={closeCommentModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="adminComment" className="form-label">
                    Admin Message to User (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="adminComment"
                    rows="4"
                    placeholder="Write a message to the user about this issue..."
                    value={commentData.comment}
                    onChange={(e) => setCommentData({ ...commentData, comment: e.target.value })}
                  ></textarea>
                  <small className="text-muted">
                    This message will be visible to the user and stored with the issue.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className={`btn ${
                    commentData.status === 'Approved' ? 'btn-success' :
                    commentData.status === 'Rejected' ? 'btn-danger' :
                    'btn-success'
                  }`}
                  onClick={handleCommentSubmit}
                >
                  {commentData.status === 'Approved' && (
                    <>
                      <i className="bi bi-check me-2"></i>Approve Issue
                    </>
                  )}
                  {commentData.status === 'Rejected' && (
                    <>
                      <i className="bi bi-x me-2"></i>Reject Issue
                    </>
                  )}
                  {commentData.status === 'Resolved' && (
                    <>
                      <i className="bi bi-check2-all me-2"></i>Mark as Resolved
                    </>
                  )}
                </button>
                <button className="btn btn-secondary" onClick={closeCommentModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
