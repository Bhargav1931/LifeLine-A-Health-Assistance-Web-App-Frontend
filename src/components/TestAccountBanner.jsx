import React from 'react';

export default function TestAccountBanner({
  testUsers,
  currentUser,
  onQuickLogin,
  onOpenTestModal
}) {
  return (
    <div className="test-banner py-2 px-3 border-bottom shadow-sm">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          {/* Tag & Description */}
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark fw-bold d-flex align-items-center gap-1 px-2 py-1">
              <i className="bi bi-flask-fill"></i> Testing Auth Mode
            </span>
            <span className="text-secondary small d-none d-md-inline">
              Pre-configured test credentials for instant Viva & project review:
            </span>
          </div>

          {/* 1-Click Role Switchers */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Patient 1-click */}
            <button
              className={`btn btn-sm rounded-pill fw-semibold ${
                currentUser?.role === 'user'
                  ? 'btn-success text-white shadow-sm'
                  : 'btn-outline-primary bg-white'
              }`}
              onClick={() => onQuickLogin('patient@lifeline.com', 'password123', 'user')}
            >
              <i className="bi bi-person-fill me-1"></i>
              {currentUser?.role === 'user' ? '✓ Logged as Patient' : '1-Click Patient (John)'}
            </button>

            {/* Doctor 1-click */}
            <button
              className={`btn btn-sm rounded-pill fw-semibold ${
                currentUser?.role === 'doctor'
                  ? 'btn-info text-white shadow-sm'
                  : 'btn-outline-info bg-white text-dark'
              }`}
              onClick={() => onQuickLogin('doctor.sharma@lifeline.com', 'password123', 'doctor')}
            >
              <i className="bi bi-heart-pulse-fill text-danger me-1"></i>
              {currentUser?.role === 'doctor' ? '✓ Logged as Doctor' : '1-Click Doctor (Dr. Sharma)'}
            </button>

            {/* Admin 1-click */}
            <button
              className={`btn btn-sm rounded-pill fw-semibold ${
                currentUser?.role === 'admin'
                  ? 'btn-dark text-white shadow-sm'
                  : 'btn-outline-dark bg-white'
              }`}
              onClick={() => onQuickLogin('admin@lifeline.com', 'admin123', 'admin')}
            >
              <i className="bi bi-shield-lock-fill text-warning me-1"></i>
              {currentUser?.role === 'admin' ? '✓ Logged as Admin' : '1-Click Admin'}
            </button>

            {/* View all button */}
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-1"
              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={onOpenTestModal}
              title="View all test credentials"
            >
              <i className="bi bi-three-dots"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
