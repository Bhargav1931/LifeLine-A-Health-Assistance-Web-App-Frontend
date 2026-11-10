import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TestAccountBanner from './components/TestAccountBanner';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import UserModule from './components/UserModule';
import DoctorModule from './components/DoctorModule';
import AdminModule from './components/AdminModule';
import HealthInfoModule from './components/HealthInfoModule';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'user', 'doctor', 'admin', 'health'
  const [currentUser, setCurrentUser] = useState(() => {
    // Default to the test patient user so viva presentation starts seamlessly!
    const saved = localStorage.getItem('lifeline_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Pre-populate with patient test user
    return {
      success: true,
      role: 'user',
      user_id: 1,
      name: 'John Doe',
      email: 'patient@lifeline.com',
      token: 'user-token-1'
    };
  });

  const [testUsers, setTestUsers] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);

  // Notification helper
  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Load test users and admin stats on mount
  useEffect(() => {
    api.getTestUsers()
      .then(users => setTestUsers(users))
      .catch(err => console.error('Failed to load test users:', err));

    api.getAdminStats()
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('lifeline_user', JSON.stringify(userData));
    notify('success', `Welcome, ${userData.name}! Logged in as ${userData.role.toUpperCase()}.`);

    // Smart navigate to the corresponding module
    if (userData.role === 'doctor') {
      setActiveTab('doctor');
    } else if (userData.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('user');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lifeline_user');
    notify('info', 'Logged out successfully.');
    setActiveTab('home');
  };

  const handleQuickLogin = async (email, password, expectedRole) => {
    try {
      const response = await api.login({ email, password });
      handleLoginSuccess(response);
    } catch (err) {
      notify('danger', `Quick login failed: ${err.message}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. Top Viva / Testing Users Quick Switcher Banner */}
      <TestAccountBanner
        testUsers={testUsers}
        currentUser={currentUser}
        onQuickLogin={handleQuickLogin}
        onOpenTestModal={() => setIsAuthOpen(true)}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenTestModal={() => setIsAuthOpen(true)}
      />

      {/* 3. Floating Notification Toast */}
      {notification && (
        <div className="notification-container">
          <div
            className={`alert alert-${notification.type} alert-dismissible fade show shadow-lg border-0 rounded-4 d-flex align-items-center gap-2`}
            role="alert"
          >
            <i
              className={`bi ${
                notification.type === 'success'
                  ? 'bi-check-circle-fill text-success'
                  : notification.type === 'danger'
                  ? 'bi-exclamation-triangle-fill text-danger'
                  : notification.type === 'warning'
                  ? 'bi-exclamation-circle-fill text-warning'
                  : 'bi-info-circle-fill text-info'
              } fs-4`}
            ></i>
            <div className="small fw-semibold">{notification.message}</div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        </div>
      )}

      {/* 4. Main Body Content Based on Active Tab */}
      <main className="flex-grow-1">
        {/* Home / Overview */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              stats={stats}
              currentUser={currentUser}
              onNavigate={(tab) => setActiveTab(tab)}
              onQuickLogin={handleQuickLogin}
            />
            {/* Embedded User Module snippet for quick booking */}
            <div className="container mb-5">
              <div className="text-center mb-4">
                <span className="badge bg-primary text-white rounded-pill px-3 py-1 mb-2">
                  Featured Doctors & Booking
                </span>
                <h3 className="fw-bold">Consult Top Medical Specialists</h3>
                <p className="text-muted small">Choose your preferred doctor, select slot, and get confirmed instantly</p>
              </div>
              <UserModule
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthOpen(true)}
                onNotify={notify}
              />
            </div>
          </>
        )}

        {/* User Module (Patient Portal) */}
        {activeTab === 'user' && (
          <div className="py-4">
            <UserModule
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onNotify={notify}
            />
          </div>
        )}

        {/* Doctor Module (Doctor Schedule & Patient Reviews) */}
        {activeTab === 'doctor' && (
          <div className="py-4">
            <DoctorModule
              currentUser={currentUser}
              onQuickLogin={handleQuickLogin}
              onNotify={notify}
            />
          </div>
        )}

        {/* Admin Module (Hospital Management & Stats) */}
        {activeTab === 'admin' && (
          <div className="py-4">
            <AdminModule
              currentUser={currentUser}
              onQuickLogin={handleQuickLogin}
              onNotify={notify}
            />
          </div>
        )}

        {/* Health Info Module (First-Aid, BMI, Emergency SOS) */}
        {activeTab === 'health' && (
          <div className="py-4">
            <HealthInfoModule onNotify={notify} />
          </div>
        )}
      </main>

      {/* 5. Authentication & Test Users Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        testUsers={testUsers}
      />

      {/* 6. Footer */}
      <footer className="bg-dark text-white py-4 mt-auto border-top">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-heart-pulse-fill text-danger fs-4"></i>
                <h5 className="fw-bold mb-0">LifeLine – Health Assistance Web App</h5>
              </div>
              <p className="text-white-50 small mb-0">
                Final Year Engineering Project • FastAPI + PostgreSQL Backend • React + Bootstrap Frontend.
                Digitized hospital appointment scheduling with conflict prevention and 24/7 emergency first aid.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap justify-content-md-end gap-2 mb-2">
                <span className="badge bg-secondary">PostgreSQL 15</span>
                <span className="badge bg-primary">FastAPI (Python)</span>
                <span className="badge bg-info text-dark">SQLAlchemy 2.0</span>
                <span className="badge bg-warning text-dark">Pydantic</span>
                <span className="badge bg-success">React 19 + Vite</span>
              </div>
              <div className="text-white-50 small">
                Viva Ready: Unique constraint on <code>(doctor_id, date, time)</code> avoids double bookings.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
