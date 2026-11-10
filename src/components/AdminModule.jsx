import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminModule({
  currentUser,
  onQuickLogin,
  onNotify
}) {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'doctors', 'users', 'appointments', 'articles'
  const [loading, setLoading] = useState(false);

  // New Doctor Form State
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: 'password123',
    specialization: 'General Physician',
    phone: '',
    qualification: 'MBBS, MD',
    experience: 5,
    consultation_fee: 500,
    availability: 'Mon - Fri: 09:00 AM - 05:00 PM'
  });

  // New Article Form State
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'First Aid',
    content: '',
    emergency_contact: '108'
  });

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [currentUser]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, docsData, usersData, apptsData, artsData] = await Promise.all([
        api.getAdminStats(),
        api.getDoctors(),
        api.getUsers(),
        api.getAppointments(),
        api.getArticles()
      ]);
      setStats(statsData);
      setDoctors(docsData);
      setUsers(usersData);
      setAppointments(apptsData);
      setArticles(artsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.addDoctor(newDoctor);
      onNotify('success', `Dr. ${newDoctor.name} added to hospital roster!`);
      setShowAddDoctorModal(false);
      setNewDoctor({
        name: '',
        email: '',
        password: 'password123',
        specialization: 'General Physician',
        phone: '',
        qualification: 'MBBS, MD',
        experience: 5,
        consultation_fee: 500,
        availability: 'Mon - Fri: 09:00 AM - 05:00 PM'
      });
      loadAllAdminData();
    } catch (err) {
      onNotify('danger', `Failed to add doctor: ${err.message}`);
    }
  };

  const handleDeleteDoctor = async (docId, docName) => {
    if (!window.confirm(`Are you sure you want to remove ${docName}?`)) return;
    try {
      await api.deleteDoctor(docId);
      onNotify('info', `Doctor ${docName} deleted successfully.`);
      loadAllAdminData();
    } catch (err) {
      onNotify('danger', `Delete failed: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete patient account "${userName}"?`)) return;
    try {
      await api.deleteUser(userId);
      onNotify('info', `Patient account deleted.`);
      loadAllAdminData();
    } catch (err) {
      onNotify('danger', `Delete failed: ${err.message}`);
    }
  };

  const handleDeleteAppointment = async (apptId) => {
    if (!window.confirm(`Delete appointment record #${apptId}?`)) return;
    try {
      await api.deleteAppointment(apptId);
      onNotify('info', `Appointment record removed.`);
      loadAllAdminData();
    } catch (err) {
      onNotify('danger', `Delete failed: ${err.message}`);
    }
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      await api.createArticle(newArticle);
      onNotify('success', 'Health education article published!');
      setShowAddArticleModal(false);
      setNewArticle({
        title: '',
        category: 'First Aid',
        content: '',
        emergency_contact: '108'
      });
      loadAllAdminData();
    } catch (err) {
      onNotify('danger', `Failed to create article: ${err.message}`);
    }
  };

  const handleDeleteArticle = async (artId, title) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await api.deleteArticle(artId);
      onNotify('info', `Article removed.`);
      loadAllAdminData();
    } catch (err) {
      onNotify('danger', `Delete failed: ${err.message}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 max-w-600 mx-auto bg-light">
          <div className="bg-dark text-warning rounded-circle p-3 d-inline-flex mx-auto mb-3" style={{ width: 64, height: 64 }}>
            <i className="bi bi-shield-lock-fill fs-2 m-auto"></i>
          </div>
          <h3 className="fw-bold mb-2">Hospital Admin Access Required</h3>
          <p className="text-muted small mb-4">
            Only authenticated system administrators can access doctor registries, user directories, and central booking analytics.
          </p>
          <div>
            <button
              className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => onQuickLogin('admin@lifeline.com', 'admin123', 'admin')}
            >
              <i className="bi bi-shield-check text-warning me-1"></i> Login with 1-Click Admin Test Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-module container mb-5">
      {/* Admin Title */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <span className="badge bg-dark text-warning p-2 rounded-circle fs-5">
              <i className="bi bi-shield-check"></i>
            </span>
            <span>Hospital Administration Module</span>
          </h2>
          <p className="text-muted mb-0 small">
            Supervise medical personnel, audit patient registrations, monitor appointments, and curate health resources.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="btn-group bg-light p-1 rounded-pill border">
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeTab === 'overview' ? 'btn-dark text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-grid-1x2-fill me-1"></i> Overview
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeTab === 'doctors' ? 'btn-dark text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('doctors')}
          >
            <i className="bi bi-hospital me-1"></i> Doctors ({doctors.length})
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeTab === 'users' ? 'btn-dark text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-1"></i> Patients ({users.length})
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeTab === 'appointments' ? 'btn-dark text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="bi bi-calendar2-check me-1"></i> Bookings ({appointments.length})
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeTab === 'articles' ? 'btn-dark text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('articles')}
          >
            <i className="bi bi-journal-medical me-1"></i> Articles ({articles.length})
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUBTAB 1: OVERVIEW & STATS */}
      {/* ==================================================================== */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-white-75 fw-semibold">Total Patients</span>
                  <i className="bi bi-people-fill fs-4 text-white-50"></i>
                </div>
                <h2 className="fw-bold mb-0">{stats?.total_users || users.length}</h2>
                <small className="text-white-50 mt-1 d-block">Registered in system</small>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-info text-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-white-75 fw-semibold">Specialist Doctors</span>
                  <i className="bi bi-hospital-fill fs-4 text-white-50"></i>
                </div>
                <h2 className="fw-bold mb-0">{stats?.total_doctors || doctors.length}</h2>
                <small className="text-white-50 mt-1 d-block">Verified healthcare staff</small>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-warning text-dark">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-semibold text-black-50">Pending Requests</span>
                  <i className="bi bi-hourglass-split fs-4 text-black-50"></i>
                </div>
                <h2 className="fw-bold mb-0">{stats?.pending_appointments || 0}</h2>
                <small className="text-black-50 mt-1 d-block">Awaiting doctor confirmation</small>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-success text-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-white-75 fw-semibold">Confirmed Bookings</span>
                  <i className="bi bi-check-circle-fill fs-4 text-white-50"></i>
                </div>
                <h2 className="fw-bold mb-0">{stats?.confirmed_appointments || 0}</h2>
                <small className="text-white-50 mt-1 d-block">Ready for consultation</small>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Recent Consultation Requests</h5>
                  <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setActiveTab('appointments')}>
                    View All
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle small">
                    <thead className="table-light">
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Slot</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(a => (
                        <tr key={a.id}>
                          <td className="fw-semibold">{a.user?.name || `User #${a.user_id}`}</td>
                          <td>{a.doctor?.name || `Doc #${a.doctor_id}`}</td>
                          <td>{a.date} ({a.time})</td>
                          <td>
                            <span className={`badge rounded-pill ${
                              a.status === 'Confirmed' ? 'bg-success' : a.status === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Quick Administrative Actions</h5>
                </div>
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-primary text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                    onClick={() => setShowAddDoctorModal(true)}
                  >
                    <div>
                      <div className="fw-bold"><i className="bi bi-person-plus-fill me-2"></i> Register New Doctor</div>
                      <small className="text-muted">Add specialized medical staff to hospital roster</small>
                    </div>
                    <i className="bi bi-plus-circle-fill fs-5 text-primary"></i>
                  </button>

                  <button
                    className="btn btn-outline-success text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                    onClick={() => setShowAddArticleModal(true)}
                  >
                    <div>
                      <div className="fw-bold"><i className="bi bi-file-earmark-medical-fill me-2"></i> Publish Health Guide</div>
                      <small className="text-muted">Add first-aid instructions or wellness education</small>
                    </div>
                    <i className="bi bi-plus-circle-fill fs-5 text-success"></i>
                  </button>

                  <button
                    className="btn btn-outline-dark text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                    onClick={() => setActiveTab('users')}
                  >
                    <div>
                      <div className="fw-bold"><i className="bi bi-person-lines-fill me-2"></i> Manage Registered Patients</div>
                      <small className="text-muted">Audit patient accounts and emergency contacts</small>
                    </div>
                    <i className="bi bi-arrow-right-circle fs-5 text-dark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 2: DOCTOR MANAGEMENT */}
      {/* ==================================================================== */}
      {activeTab === 'doctors' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Hospital Doctors Registry</h4>
              <small className="text-muted">Manage credentials, department specializations, and availability</small>
            </div>
            <button
              className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddDoctorModal(true)}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add New Doctor</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Degree / Exp</th>
                  <th>Contact</th>
                  <th>Fee</th>
                  <th>Availability</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.id}>
                    <td><code>#{doc.id}</code></td>
                    <td className="fw-bold text-dark">{doc.name}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{doc.specialization}</span></td>
                    <td className="small">{doc.qualification} ({doc.experience} yrs)</td>
                    <td className="small">
                      <div>{doc.email}</div>
                      <div className="text-muted">{doc.phone || 'N/A'}</div>
                    </td>
                    <td className="fw-semibold text-success">₹{doc.consultation_fee}</td>
                    <td className="small text-muted">{doc.availability}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                        title="Delete Doctor"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 3: PATIENT USERS MANAGEMENT */}
      {/* ==================================================================== */}
      {activeTab === 'users' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Registered Patients Registry</h4>
              <small className="text-muted">Audit user accounts and manage registered patient records</small>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><code>#{u.id}</code></td>
                    <td className="fw-bold text-dark">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td><span className="badge bg-light text-dark border text-uppercase">{u.role}</span></td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        title="Delete Patient"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 4: ALL APPOINTMENTS */}
      {/* ==================================================================== */}
      {activeTab === 'appointments' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Master Appointment Logs</h4>
              <small className="text-muted">Live appointments across all doctors and patients</small>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Appt #</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Doctor Note</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td><code>#{a.id}</code></td>
                    <td className="fw-bold">{a.user?.name || `Patient #${a.user_id}`}</td>
                    <td>
                      <div className="fw-semibold">{a.doctor?.name || `Dr. #${a.doctor_id}`}</div>
                      <small className="text-muted">{a.doctor?.specialization}</small>
                    </td>
                    <td>
                      <div><strong>{a.date}</strong></div>
                      <small className="text-muted">{a.time}</small>
                    </td>
                    <td className="small text-truncate" style={{ maxWidth: '180px' }}>
                      {a.symptoms || '—'}
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${
                        a.status === 'Confirmed'
                          ? 'bg-success'
                          : a.status === 'Pending'
                          ? 'bg-warning text-dark'
                          : a.status === 'Rejected'
                          ? 'bg-danger'
                          : 'bg-secondary'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="small fst-italic text-muted">{a.notes || '—'}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => handleDeleteAppointment(a.id)}
                        title="Delete record"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 5: HEALTH ARTICLES */}
      {/* ==================================================================== */}
      {activeTab === 'articles' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Health & First-Aid Guides Management</h4>
              <small className="text-muted">Publish critical instructions for common medical emergencies</small>
            </div>
            <button
              className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddArticleModal(true)}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Create Guide</span>
            </button>
          </div>

          <div className="row g-3">
            {articles.map(art => (
              <div key={art.id} className="col-md-6">
                <div className="card border rounded-3 p-3 h-100 bg-light">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary text-white">{art.category}</span>
                    <button
                      className="btn btn-sm text-danger p-0 border-0"
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <h6 className="fw-bold mb-2">{art.title}</h6>
                  <p className="small text-muted mb-2 text-truncate-3" style={{ whiteSpace: 'pre-line' }}>
                    {art.content}
                  </p>
                  {art.emergency_contact && (
                    <div className="small text-danger fw-bold mt-auto">
                      <i className="bi bi-telephone-fill me-1"></i> Emergency SOS: {art.emergency_contact}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD NEW DOCTOR */}
      {/* ==================================================================== */}
      {showAddDoctorModal && (
        <div className="modal show d-block fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 px-4 py-3">
                <h5 className="modal-title fw-bold">Register New Doctor</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddDoctorModal(false)}></button>
              </div>
              <form onSubmit={handleAddDoctor}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Doctor Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Dr. Full Name"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="doctor@lifeline.com"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Specialization</label>
                      <select
                        className="form-select"
                        value={newDoctor.specialization}
                        onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                      >
                        <option value="General Physician">General Physician</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gynecologist">Gynecologist</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Qualifications</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. MBBS, MD, DM"
                        value={newDoctor.qualification}
                        onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Years of Experience</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newDoctor.experience}
                        onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) })}
                        min={1}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newDoctor.consultation_fee}
                        onChange={(e) => setNewDoctor({ ...newDoctor, consultation_fee: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Contact Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="+91 98765 00000"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Availability Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Mon - Fri: 09:00 AM - 05:00 PM"
                        value={newDoctor.availability}
                        onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowAddDoctorModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                    Save & Register Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD HEALTH ARTICLE */}
      {/* ==================================================================== */}
      {showAddArticleModal && (
        <div className="modal show d-block fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white border-0 px-4 py-3">
                <h5 className="modal-title fw-bold">Publish Health Guide</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddArticleModal(false)}></button>
              </div>
              <form onSubmit={handleAddArticle}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Article Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. First Aid for Heatstroke"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={newArticle.category}
                        onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      >
                        <option value="First Aid">First Aid</option>
                        <option value="Emergency">Emergency</option>
                        <option value="General Health">General Health</option>
                        <option value="Nutrition">Nutrition</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Helpline Number (SOS)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 108 or 112"
                        value={newArticle.emergency_contact}
                        onChange={(e) => setNewArticle({ ...newArticle, emergency_contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Guide Content (Steps / Tips)</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Step 1: ...&#10;Step 2: ..."
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowAddArticleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold">
                    Publish Guide
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
