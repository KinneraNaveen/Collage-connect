import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import api from '../../utils/api';
import IssueList from './IssueList';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import './IssuesPage.css';

const IssuesPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalIssues, setTotalIssues] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchIssues();
  }, [currentPage, filters.status, filters.category]);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = user.role === 'admin' ? '/issues' : '/issues/my-issues';
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);

      const response = await api.get(`${endpoint}?${params}`);
      let filteredIssues = response.data.issues || [];
      
      // Client-side search filtering
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredIssues = filteredIssues.filter(issue => 
          issue.title.toLowerCase().includes(searchTerm) ||
          issue.description.toLowerCase().includes(searchTerm) ||
          (issue.studentId && issue.studentId.name && issue.studentId.name.toLowerCase().includes(searchTerm))
        );
      }
      
      setIssues(filteredIssues);
      setTotalIssues(response.data.total || response.data.issues.length);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.status, filters.category, filters.search, user.role, itemsPerPage]);

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
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchIssues();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalIssues / itemsPerPage);

  if (loading && issues.length === 0) {
    return (
      <div className="issues-page-container">
        <div className="container">
          <div className="text-center py-5">
            <LoadingSkeleton rows={5} columns={5} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="issues-page-container">
      <div className="container">
        {/* Header */}
        <div className="issues-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="issues-title">
                <i className="bi bi-list-ul me-2"></i>
                {user.role === 'admin' ? 'All Issues' : 'My Issues'}
              </h1>
              <p className="text-muted">
                {user.role === 'admin' 
                  ? 'Manage and track all submitted issues' 
                  : 'View and track your submitted issues'
                }
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search issues..."
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Technical">Technical</option>
                  <option value="Facility">Facility</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Issues ({totalIssues})
              </h5>
              <div className="text-muted">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
          <div className="card-body">
            <IssueList 
              issues={issues} 
              onViewIssue={handleViewIssue} 
              loading={loading}
            />

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
                    {selectedIssue.studentId && (
                      <p><strong>Student:</strong> {selectedIssue.studentId.name}</p>
                    )}
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

export default IssuesPage;
