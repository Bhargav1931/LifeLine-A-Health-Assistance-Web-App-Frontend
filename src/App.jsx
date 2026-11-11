import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import UserModule from './components/UserModule';
import DoctorModule from './components/DoctorModule';
import AdminModule from './components/AdminModule';
import HealthInfoModule from './components/HealthInfoModule';
import AccessDenied from './components/AccessDenied';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'user', 'doctor', 'admin', 'health'
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lifeline_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' or 'register'
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);

  // Notification helper
  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  // Load admin stats on mount
  useEffect(() => {
    api.getAdminStats()
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('lifeline_user', JSON.stringify(userData));
    notify('success', `Welcome back, ${userData.name}! Logged in as ${userData.role.toUpperCase()}.`);

    // Role-based automatic redirect to user's dedicated dashboard
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

  const handleSwitchAccount = () => {
    handleLogout();
    handleOpenAuth('login');
  };

  const role = currentUser?.role;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. Main Navigation Bar with Role-Based Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* 2. Floating Notification Toast */}
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

      {/* 3. Main Body Content with Role-Based Access Guards */}
      <main className="flex-grow-1">
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              stats={stats}
              currentUser={currentUser}
              onNavigate={(tab) => {
                // Prevent doctor from jumping into user booking via hero button
                if (tab === 'user' && role === 'doctor') {
                  setActiveTab('doctor');
                } else if (tab === 'user' && role === 'admin') {
                  setActiveTab('admin');
                } else {
                  setActiveTab(tab);
                }
              }}
            />

            {/* Role-tailored section below Hero */}
            {role === 'doctor' ? (
              <div className="container mb-5">
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-gradient-light border-start border-primary border-5 text-center">
                  <div className="d-inline-flex bg-primary text-white rounded-circle p-3 mx-auto mb-3" style={{ width: 64, height: 64 }}>
                    <i className="bi bi-hospital fs-3 m-auto"></i>
                  </div>
                  <h3 className="fw-bold mb-2">Welcome to Doctor Portal, {currentUser.name}!</h3>
                  <p className="text-muted small mb-4 max-w-600 mx-auto">
                    You have dedicated access to review patient appointment requests, check symptoms, accept or reject consultation slots, and update your working hours.
                  </p>
                  <div>
                    <button
                      className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm"
                      onClick={() => setActiveTab('doctor')}
                    >
                      <i className="bi bi-calendar2-check-fill me-2"></i> Open Doctor Portal
                    </button>
                  </div>
                </div>
              </div>
            ) : role === 'admin' ? (
              <div className="container mb-5">
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-gradient-light border-start border-dark border-5 text-center">
                  <div className="d-inline-flex bg-dark text-warning rounded-circle p-3 mx-auto mb-3" style={{ width: 64, height: 64 }}>
                    <i className="bi bi-shield-check fs-3 m-auto"></i>
                  </div>
                  <h3 className="fw-bold mb-2">Hospital Administrator Portal</h3>
                  <p className="text-muted small mb-4 max-w-600 mx-auto">
                    Manage specialist doctor registries, audit registered patients, monitor system bookings, and publish health articles.
                  </p>
                  <div>
                    <button
                      className="btn btn-dark rounded-pill px-5 py-2 fw-bold shadow-sm"
                      onClick={() => setActiveTab('admin')}
                    >
                      <i className="bi bi-grid-1x2-fill me-2"></i> Open Admin Control Center
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Patients and Guests see the Doctor Directory & Booking */
              <div className="container mb-5">
                <div className="text-center mb-4">
                  <span className="badge bg-primary text-white rounded-pill px-3 py-1 mb-2">
                    Verified Specialists
                  </span>
                  <h3 className="fw-bold">Consult Top Medical Specialists</h3>
                  <p className="text-muted small">Choose your preferred doctor, select slot, and get confirmed instantly</p>
                </div>
                <UserModule
                  currentUser={currentUser}
                  onOpenAuth={() => handleOpenAuth('login')}
                  onNotify={notify}
                />
              </div>
            )}
          </>
        )}

        {/* TAB 2: USER MODULE (Book Appointment / Patient Portal) */}
        {activeTab === 'user' && (
          <div className="py-4">
            {role === 'doctor' ? (
              <AccessDenied
                title="Doctor Role Restriction"
                message="Doctors cannot book appointments as patients. Please use your Doctor Portal to manage your consultation requests and schedule."
                requiredRole="patient"
                currentUser={currentUser}
                onNavigate={setActiveTab}
                onSwitchAccount={handleSwitchAccount}
              />
            ) : role === 'admin' ? (
              <AccessDenied
                title="Administrator Notice"
                message="Administrators manage hospital bookings through the Admin Dashboard. Patient booking is restricted to patient accounts."
                requiredRole="patient"
                currentUser={currentUser}
                onNavigate={setActiveTab}
                onSwitchAccount={handleSwitchAccount}
              />
            ) : (
              <UserModule
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('login')}
                onNotify={notify}
              />
            )}
          </div>
        )}

        {/* TAB 3: DOCTOR MODULE (Doctor Portal) */}
        {activeTab === 'doctor' && (
          <div className="py-4">
            {role === 'user' ? (
              <AccessDenied
                title="Doctor Portal Restricted"
                message="Access to the Doctor Portal is reserved for verified medical specialists. You are currently logged in with a Patient account."
                requiredRole="doctor"
                currentUser={currentUser}
                onNavigate={setActiveTab}
                onSwitchAccount={handleSwitchAccount}
              />
            ) : role === 'admin' ? (
              <AccessDenied
                title="Administrator Access Notice"
                message="Please manage doctors, staff, and hospital schedules directly through the Admin Dashboard."
                requiredRole="doctor"
                currentUser={currentUser}
                onNavigate={setActiveTab}
                onSwitchAccount={handleSwitchAccount}
              />
            ) : (
              <DoctorModule
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('login')}
                onNotify={notify}
              />
            )}
          </div>
        )}

        {/* TAB 4: ADMIN MODULE (Admin Dashboard) */}
        {activeTab === 'admin' && (
          <div className="py-4">
            {role === 'user' || role === 'doctor' ? (
              <AccessDenied
                title="Administrator Privileges Required"
                message={`Access to the hospital administration center is restricted. Your current account role (${role.toUpperCase()}) does not have administrative permissions.`}
                requiredRole="admin"
                currentUser={currentUser}
                onNavigate={setActiveTab}
                onSwitchAccount={handleSwitchAccount}
              />
            ) : (
              <AdminModule
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('login')}
                onNotify={notify}
              />
            )}
          </div>
        )}

        {/* TAB 5: HEALTH INFO & EMERGENCY HELPLINE (Open to all) */}
        {activeTab === 'health' && (
          <div className="py-4">
            <HealthInfoModule onNotify={notify} />
          </div>
        )}
      </main>

      {/* 4. Standard Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authInitialTab}
      />

      {/* 5. Footer */}
      <footer className="bg-dark text-white py-4 mt-auto border-top">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-heart-pulse-fill text-danger fs-4"></i>
                <h5 className="fw-bold mb-0">LifeLine – Health Assistance Web App</h5>
              </div>
              <p className="text-white-50 small mb-0">
                A digitized health assistance platform bridging patients with doctors, offering real-time appointment scheduling, conflict-free bookings, and emergency first-aid assistance.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap justify-content-md-end gap-2 mb-2">
                <span className="badge bg-secondary">PostgreSQL</span>
                <span className="badge bg-primary">FastAPI</span>
                <span className="badge bg-info text-dark">SQLAlchemy</span>
                <span className="badge bg-success">React + Vite</span>
                <span className="badge bg-warning text-dark">Bootstrap 5</span>
              </div>
              <div className="text-white-50 small">
                © {new Date().getFullYear()} LifeLine Health System. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
