import React from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-gradient sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand */}
        <button
          className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent text-white fw-bold fs-4"
          onClick={() => setActiveTab('home')}
        >
          <span className="brand-icon">
            <i className="bi bi-heart-pulse-fill text-danger fs-3 bg-white p-1 rounded-circle shadow-sm"></i>
          </span>
          <span>Life<span className="text-warning">Line</span></span>
          <span className="badge bg-white text-primary fs-7 fw-semibold ms-1 px-2 py-1 rounded-pill">
            Health Assistance
          </span>
        </button>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#lifelineNav"
        >
          <i className="bi bi-list text-white fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="lifelineNav">
          {/* Navigation Items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill ${
                  activeTab === 'home' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => setActiveTab('home')}
              >
                <i className="bi bi-house-door me-1"></i> Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill ${
                  activeTab === 'user' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => setActiveTab('user')}
              >
                <i className="bi bi-calendar2-check me-1"></i> Book Appointment
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill ${
                  activeTab === 'doctor' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => setActiveTab('doctor')}
              >
                <i className="bi bi-person-badge me-1"></i> Doctor Portal
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill ${
                  activeTab === 'admin' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                <i className="bi bi-shield-check me-1"></i> Admin
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill ${
                  activeTab === 'health' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => setActiveTab('health')}
              >
                <i className="bi bi-heart-half me-1"></i> Health Info & SOS
              </button>
            </li>
          </ul>

          {/* User Auth Section */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 border border-white-25 rounded-pill px-3 py-1 text-white">
                  <span className="badge rounded-circle bg-white text-primary p-2">
                    <i className={`bi ${
                      currentUser.role === 'admin'
                        ? 'bi-shield-shaded'
                        : currentUser.role === 'doctor'
                        ? 'bi-hospital'
                        : 'bi-person-fill'
                    }`}></i>
                  </span>
                  <span className="text-truncate fw-semibold" style={{ maxWidth: '140px' }}>
                    {currentUser.name}
                  </span>
                  <span className="badge bg-warning text-dark text-uppercase fs-8">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  className="btn btn-outline-light btn-sm rounded-pill px-3"
                  onClick={onLogout}
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-light btn-sm fw-bold text-primary rounded-pill px-3 shadow-sm"
                  onClick={() => onOpenAuth('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
                <button
                  className="btn btn-warning btn-sm fw-bold text-dark rounded-pill px-3 shadow-sm"
                  onClick={() => onOpenAuth('register')}
                >
                  <i className="bi bi-person-plus-fill me-1"></i> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
