import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsNavOpen(false); // Close mobile navbar on selection
  };

  const handleAuthAction = (action) => {
    setIsNavOpen(false);
    if (action === 'logout') {
      onLogout();
    } else {
      onOpenAuth(action);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-gradient sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand */}
        <button
          className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent text-white fw-bold fs-4 p-0"
          onClick={() => handleNavClick('home')}
        >
          <span className="brand-icon">
            <i className="bi bi-heart-pulse-fill text-danger fs-3 bg-white p-1 rounded-circle shadow-sm"></i>
          </span>
          <span>Life<span className="text-warning">Line</span></span>
          <span className="badge bg-white text-primary fs-7 fw-semibold ms-1 px-2 py-1 rounded-pill d-none d-sm-inline">
            Health Assistance
          </span>
        </button>

        {/* Mobile Header Quick Actions & Toggler */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          {currentUser ? (
            <div className="d-flex align-items-center gap-1 text-white bg-white bg-opacity-10 px-2 py-1 rounded-pill small">
              <span className="badge rounded-circle bg-white text-primary p-1">
                <i className={`bi ${
                  currentUser.role === 'admin'
                    ? 'bi-shield-shaded'
                    : currentUser.role === 'doctor'
                    ? 'bi-hospital'
                    : 'bi-person-fill'
                }`}></i>
              </span>
              <span className="text-truncate fw-semibold" style={{ maxWidth: '85px' }}>
                {currentUser.name}
              </span>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-light text-primary fw-bold rounded-pill px-2 py-1"
              onClick={() => handleAuthAction('login')}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
            </button>
          )}

          {/* Hamburger / Close Toggle Button */}
          <button
            className="navbar-toggler border-0 p-1 text-white shadow-none focus-ring-none"
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${isNavOpen ? 'bi-x-lg text-warning' : 'bi-list'} fs-2`}></i>
          </button>
        </div>

        {/* Collapsible Content */}
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show mobile-nav-expanded' : ''}`} id="lifelineNav">
          {/* Navigation Items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1 pt-2 pt-lg-0">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill w-100 text-start text-lg-center ${
                  activeTab === 'home' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => handleNavClick('home')}
              >
                <i className="bi bi-house-door me-2 me-lg-1"></i> Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill w-100 text-start text-lg-center ${
                  activeTab === 'user' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => handleNavClick('user')}
              >
                <i className="bi bi-calendar2-check me-2 me-lg-1"></i> Book Appointment
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill w-100 text-start text-lg-center ${
                  activeTab === 'doctor' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => handleNavClick('doctor')}
              >
                <i className="bi bi-person-badge me-2 me-lg-1"></i> Doctor Portal
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill w-100 text-start text-lg-center ${
                  activeTab === 'admin' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => handleNavClick('admin')}
              >
                <i className="bi bi-shield-check me-2 me-lg-1"></i> Admin
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none px-3 py-2 rounded-pill w-100 text-start text-lg-center ${
                  activeTab === 'health' ? 'active-nav-item' : 'text-white-75'
                }`}
                onClick={() => handleNavClick('health')}
              >
                <i className="bi bi-heart-half me-2 me-lg-1"></i> Health Info & SOS
              </button>
            </li>
          </ul>

          {/* User Auth Section (Desktop and Mobile Dropdown) */}
          <div className="pt-3 pt-lg-0 border-top border-white-25 border-lg-0 mt-2 mt-lg-0">
            {currentUser ? (
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
                {/* User Info Badge */}
                <div className="d-flex align-items-center justify-content-between justify-content-lg-start gap-2 bg-white bg-opacity-10 border border-white-25 rounded-pill px-3 py-2 py-lg-1 text-white">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge rounded-circle bg-white text-primary p-2">
                      <i className={`bi ${
                        currentUser.role === 'admin'
                          ? 'bi-shield-shaded'
                          : currentUser.role === 'doctor'
                          ? 'bi-hospital'
                          : 'bi-person-fill'
                      }`}></i>
                    </span>
                    <span className="fw-semibold text-truncate" style={{ maxWidth: '160px' }}>
                      {currentUser.name}
                    </span>
                  </div>
                  <span className="badge bg-warning text-dark text-uppercase fs-8 px-2 py-1">
                    {currentUser.role}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  className="btn btn-outline-danger btn-sm text-white border-white-50 rounded-pill px-3 py-2 py-lg-1 w-100 w-lg-auto fw-semibold"
                  onClick={() => handleAuthAction('logout')}
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
                <button
                  className="btn btn-light btn-sm fw-bold text-primary rounded-pill px-4 py-2 py-lg-1 shadow-sm w-100 w-lg-auto"
                  onClick={() => handleAuthAction('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
                <button
                  className="btn btn-warning btn-sm fw-bold text-dark rounded-pill px-4 py-2 py-lg-1 shadow-sm w-100 w-lg-auto"
                  onClick={() => handleAuthAction('register')}
                >
                  <i className="bi bi-person-plus-fill me-1"></i> Register as Patient
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
