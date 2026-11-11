import React, { useState } from 'react';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login'
}) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'register'
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
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-primary text-white border-0 px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill fs-4 text-warning"></i>
              <div>
                <h5 className="modal-title fw-bold mb-0">LifeLine Health Portal</h5>
                <small className="text-white-75">Sign in to your account</small>
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
                  className={`nav-link fw-semibold border-0 ${
                    tab === 'login'
                      ? 'active text-primary bg-white border-bottom border-primary border-3'
                      : 'text-secondary'
                  }`}
                  onClick={() => { setTab('login'); setError(null); }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold border-0 ${
                    tab === 'register'
                      ? 'active text-primary bg-white border-bottom border-primary border-3'
                      : 'text-secondary'
                  }`}
                  onClick={() => { setTab('register'); setError(null); }}
                >
                  <i className="bi bi-person-plus-fill me-1"></i> Patient Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 mb-3" role="alert">
                <i className="bi bi-exclamation-octagon-fill fs-5"></i>
                <div className="small">{error}</div>
              </div>
            )}

            {/* TAB 1: Standard Login for Patient, Doctor, Admin */}
            {tab === 'login' && (
              <form onSubmit={handleStandardLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email or Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter registered email or username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <small className="text-muted fs-8 mt-1 d-block">
                    Supports Patient, Doctor, and Administrator login credentials.
                  </small>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-key"></i></span>
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
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...</span>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center mt-3 small text-muted">
                  Don't have a patient account?{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                    onClick={() => { setTab('register'); setError(null); }}
                  >
                    Register as Patient
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Patient Registration */}
            {tab === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create password (min 4 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={4}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-bold rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2" role="status"></span>Registering...</span>
                  ) : (
                    'Complete Patient Registration'
                  )}
                </button>

                <div className="text-center mt-3 small text-muted">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                    onClick={() => { setTab('login'); setError(null); }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
