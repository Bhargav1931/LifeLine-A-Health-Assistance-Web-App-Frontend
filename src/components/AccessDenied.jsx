import React from 'react';

export default function AccessDenied({
  title = "Access Restricted",
  message = "You do not have permission to access this portal with your current role.",
  requiredRole = "patient",
  currentUser,
  onNavigate,
  onSwitchAccount
}) {
  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-5 max-w-600 mx-auto bg-light text-center">
        <div
          className="bg-danger-subtle text-danger rounded-circle p-3 d-inline-flex mx-auto mb-3"
          style={{ width: 72, height: 72 }}
        >
          <i className="bi bi-shield-lock-fill fs-1 m-auto"></i>
        </div>

        <h3 className="fw-bold mb-2 text-dark">{title}</h3>
        <p className="text-muted small mb-4">{message}</p>

        {currentUser && (
          <div className="bg-white rounded-3 p-3 border mb-4 text-start small">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted">Currently Signed In:</span>
                <div className="fw-bold text-dark">{currentUser.name}</div>
                <div className="text-muted">{currentUser.email}</div>
              </div>
              <span className="badge bg-warning text-dark text-uppercase px-2 py-1">
                Role: {currentUser.role}
              </span>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
          {currentUser?.role === 'doctor' && (
            <button
              className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => onNavigate('doctor')}
            >
              <i className="bi bi-hospital me-1"></i> Go to Doctor Portal
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => onNavigate('admin')}
            >
              <i className="bi bi-shield-check me-1"></i> Go to Admin Dashboard
            </button>
          )}

          {currentUser?.role === 'user' && (
            <button
              className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => onNavigate('user')}
            >
              <i className="bi bi-calendar2-check me-1"></i> Go to Patient Portal
            </button>
          )}

          <button
            className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
            onClick={onSwitchAccount}
          >
            <i className="bi bi-arrow-left-right me-1"></i> Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
