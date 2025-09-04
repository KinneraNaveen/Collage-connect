import React, { memo } from 'react';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import LoadingSkeleton from '../ui/LoadingSkeleton';

const IssueList = memo(({ issues, onViewIssue, loading }) => {
  if (loading) {
    return <LoadingSkeleton rows={5} columns={5} />;
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-inbox display-1 text-muted"></i>
        <h5 className="mt-3">No issues found</h5>
        <p className="text-muted">No issues match the current criteria</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue._id}>
              <td>
                <strong>{issue.title}</strong>
                <br />
                <small className="text-muted">
                  {issue.description.length > 50 
                    ? `${issue.description.substring(0, 50)}...` 
                    : issue.description
                  }
                </small>
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
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onViewIssue(issue)}
                  title="View Details"
                >
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

IssueList.displayName = 'IssueList';

export default IssueList;
