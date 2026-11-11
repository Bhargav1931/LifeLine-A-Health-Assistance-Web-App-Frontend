import React from 'react';

export default function HeroSection({
  stats,
  currentUser,
  onNavigate
}) {
  return (
    <div className="hero-section text-white position-relative overflow-hidden mb-5">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="container py-5 position-relative z-1">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            {/* Top Tag */}
            <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-pill mb-3 backdrop-blur">
              <span className="pulse-indicator"></span>
              <span className="small fw-semibold">Digitized Healthcare & Zero Waiting Time</span>
            </div>

            <h1 className="display-4 fw-extrabold mb-3 line-height-tight">
              Life<span className="text-warning">Line</span> Health Assistance
            </h1>
            <p className="lead text-white-75 mb-4 pe-lg-4 fs-6">
              A comprehensive health system bridging patients with verified medical specialists.
              Book appointments instantly, avoid hospital queues, calculate your BMI, and access 24/7 life-saving emergency first-aid tips.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <button
                className="btn btn-warning btn-lg fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                onClick={() => onNavigate('user')}
              >
                <i className="bi bi-calendar2-check-fill"></i>
                <span>Book Appointment</span>
              </button>
              <button
                className="btn btn-outline-light btn-lg fw-semibold px-4 py-2 rounded-pill d-flex align-items-center gap-2"
                onClick={() => onNavigate('health')}
              >
                <i className="bi bi-heart-pulse-fill text-danger"></i>
                <span>Emergency SOS & First Aid</span>
              </button>
            </div>

            {/* Quick stats pills */}
            <div className="row g-2 pt-2 border-top border-white-25">
              <div className="col-4">
                <div className="fw-bold fs-4 text-warning mb-0">
                  {stats?.total_doctors || '6+'}
                </div>
                <div className="text-white-50 small">Specialist Doctors</div>
              </div>
              <div className="col-4">
                <div className="fw-bold fs-4 text-warning mb-0">
                  {stats?.total_appointments || '100%'}
                </div>
                <div className="text-white-50 small">Slot Conflict Free</div>
              </div>
              <div className="col-4">
                <div className="fw-bold fs-4 text-warning mb-0">24/7</div>
                <div className="text-white-50 small">Emergency Helpline</div>
              </div>
            </div>
          </div>

          {/* Right Card / Interactive Overview */}
          <div className="col-lg-5">
            <div className="card glass-card border-0 rounded-4 p-4 shadow-lg text-dark">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="bi bi-activity fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Quick Access Hub</h6>
                    <small className="text-muted">Explore System Modules</small>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success border px-2 py-1">
                  ● System Online
                </span>
              </div>

              {/* Module cards */}
              <div className="d-flex flex-column gap-2">
                <div
                  className="quick-card p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => onNavigate('user')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-people-fill text-primary fs-4"></i>
                    <div>
                      <div className="fw-bold small">User / Patient Module</div>
                      <div className="text-muted fs-8">Browse doctors & schedule appointments</div>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>

                <div
                  className="quick-card p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => onNavigate('doctor')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-heart-pulse text-danger fs-4"></i>
                    <div>
                      <div className="fw-bold small">Doctor Module</div>
                      <div className="text-muted fs-8">Review patient bookings, accept or reject</div>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>

                <div
                  className="quick-card p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => onNavigate('admin')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-shield-lock-fill text-warning fs-4"></i>
                    <div>
                      <div className="fw-bold small">Admin Control Module</div>
                      <div className="text-muted fs-8">Manage doctors, patients & bookings</div>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>

                <div
                  className="quick-card p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => onNavigate('health')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-calculator-fill text-success fs-4"></i>
                    <div>
                      <div className="fw-bold small">BMI Calculator & First-Aid</div>
                      <div className="text-muted fs-8">Check body mass index & helpline 108/112</div>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
