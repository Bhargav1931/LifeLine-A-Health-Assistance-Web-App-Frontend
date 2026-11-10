import React, { useState } from 'react';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  testUsers = []
}) {
  const [tab, setTab] = useState('test'); // 'test', 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.login({ email, password });
      onLoginSuccess(response);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register({ name, email, password, phone });
      // Automatically log the newly registered patient in
      const loginRes = await api.login({ email, password });
      onLoginSuccess(loginRes);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickLogin = async (userEmail, userPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login({ email: userEmail, password: userPassword });
      onLoginSuccess(response);
      onClose();
    } catch (err) {
      setError(err.message || '1-Click login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-primary text-white border-0 px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill fs-4 text-warning"></i>
              <div>
                <h5 className="modal-title fw-bold mb-0">LifeLine Access & Authentication</h5>
                <small className="text-white-50">Testing users configured for Viva & Evaluation</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-light border-bottom px-4 pt-2">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold border-0 ${tab === 'test' ? 'active text-primary bg-white border-bottom border-primary border-3' : 'text-secondary'}`}
                  onClick={() => { setTab('test'); setError(null); }}
                >
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> 1-Click Test Users (Viva)
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold border-0 ${tab === 'login' ? 'active text-primary bg-white border-bottom border-primary border-3' : 'text-secondary'}`}
                  onClick={() => { setTab('login'); setError(null); }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Standard Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold border-0 ${tab === 'register' ? 'active text-primary bg-white border-bottom border-primary border-3' : 'text-secondary'}`}
                  onClick={() => { setTab('register'); setError(null); }}
                >
                  <i className="bi bi-person-plus-fill me-1"></i> Patient Register
                </button>
              </li>
            </ul>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert">
                <i className="bi bi-exclamation-octagon-fill fs-5"></i>
                <div className="small">{error}</div>
              </div>
            )}

            {/* TAB 1: 1-Click Test Users */}
            {tab === 'test' && (
              <div>
                <p className="text-muted small mb-3">
                  As requested in your project requirements, testing users are pre-seeded in PostgreSQL. Click any role below for instant authentication into that module:
                </p>

                <div className="row g-3">
                  {/* Patient Card */}
                  <div className="col-md-6">
                    <div className="card h-100 border border-primary-subtle shadow-sm rounded-3 p-3 role-test-card">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                          <i className="bi bi-person-fill me-1"></i> Patient Role
                        </span>
                        <span className="badge bg-light text-muted border">User Module</span>
                      </div>
                      <h6 className="fw-bold mb-1">John Doe</h6>
                      <div className="small text-muted mb-2">
                        <div><strong>Email:</strong> <code>patient@lifeline.com</code></div>
                        <div><strong>Pass:</strong> <code>password123</code></div>
                        <div className="text-secondary mt-1">Can search doctors, book appointments with conflict detection, and cancel slots.</div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm mt-auto w-100 fw-bold rounded-pill"
                        disabled={loading}
                        onClick={() => handle1ClickLogin('patient@lifeline.com', 'password123')}
                      >
                        {loading ? 'Authenticating...' : 'Login as Patient (John)'}
                      </button>
                    </div>
                  </div>

                  {/* Doctor Card */}
                  <div className="col-md-6">
                    <div className="card h-100 border border-info-subtle shadow-sm rounded-3 p-3 role-test-card">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-info-subtle text-dark fw-bold px-2 py-1">
                          <i className="bi bi-heart-pulse-fill text-danger me-1"></i> Doctor Role
                        </span>
                        <span className="badge bg-light text-muted border">Doctor Module</span>
                      </div>
                      <h6 className="fw-bold mb-1">Dr. Rajesh Sharma</h6>
                      <div className="small text-muted mb-2">
                        <div><strong>Email:</strong> <code>doctor.sharma@lifeline.com</code></div>
                        <div><strong>Pass:</strong> <code>password123</code></div>
                        <div><strong>Specialization:</strong> Cardiologist (15 yrs exp)</div>
                        <div className="text-secondary mt-1">Can review assigned bookings, view patient symptoms, and Accept or Reject.</div>
                      </div>
                      <button
                        className="btn btn-info text-white btn-sm mt-auto w-100 fw-bold rounded-pill"
                        disabled={loading}
                        onClick={() => handle1ClickLogin('doctor.sharma@lifeline.com', 'password123')}
                      >
                        {loading ? 'Authenticating...' : 'Login as Dr. Sharma'}
                      </button>
                    </div>
                  </div>

                  {/* Additional Doctor: Pediatrician */}
                  <div className="col-md-6">
                    <div className="card h-100 border border-success-subtle shadow-sm rounded-3 p-3 role-test-card">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-success-subtle text-success fw-bold px-2 py-1">
                          <i className="bi bi-bandaid me-1"></i> Doctor Role
                        </span>
                        <span className="badge bg-light text-muted border">Pediatrics</span>
                      </div>
                      <h6 className="fw-bold mb-1">Dr. Priya Patel</h6>
                      <div className="small text-muted mb-2">
                        <div><strong>Email:</strong> <code>doctor.patel@lifeline.com</code></div>
                        <div><strong>Pass:</strong> <code>password123</code></div>
                        <div><strong>Specialization:</strong> Pediatrician (10 yrs exp)</div>
                      </div>
                      <button
                        className="btn btn-outline-success btn-sm mt-auto w-100 fw-bold rounded-pill"
                        disabled={loading}
                        onClick={() => handle1ClickLogin('doctor.patel@lifeline.com', 'password123')}
                      >
                        {loading ? 'Authenticating...' : 'Login as Dr. Patel'}
                      </button>
                    </div>
                  </div>

                  {/* Admin Card */}
                  <div className="col-md-6">
                    <div className="card h-100 border border-dark-subtle shadow-sm rounded-3 p-3 role-test-card">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-dark text-white fw-bold px-2 py-1">
                          <i className="bi bi-shield-check text-warning me-1"></i> Admin Role
                        </span>
                        <span className="badge bg-light text-muted border">Admin Module</span>
                      </div>
                      <h6 className="fw-bold mb-1">Super Administrator</h6>
                      <div className="small text-muted mb-2">
                        <div><strong>User/Email:</strong> <code>admin@lifeline.com</code> or <code>admin</code></div>
                        <div><strong>Pass:</strong> <code>admin123</code></div>
                        <div className="text-secondary mt-1">Full control: Add/Remove doctors, manage patients, view all hospital bookings.</div>
                      </div>
                      <button
                        className="btn btn-dark btn-sm mt-auto w-100 fw-bold rounded-pill"
                        disabled={loading}
                        onClick={() => handle1ClickLogin('admin@lifeline.com', 'admin123')}
                      >
                        {loading ? 'Authenticating...' : 'Login as Admin'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Standard Login */}
            {tab === 'login' && (
              <form onSubmit={handleStandardLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email or Admin Username</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="patient@lifeline.com or admin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-key"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* TAB 3: Patient Register */}
            {tab === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create a strong password (min 4 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-bold rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Complete Patient Registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
