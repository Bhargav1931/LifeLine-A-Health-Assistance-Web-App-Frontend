import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function DoctorModule({
  currentUser,
  onOpenAuth,
  onNotify
}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionNotes, setActionNotes] = useState({});
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    availability: '',
    consultation_fee: 500,
    phone: ''
  });

  const isDoctor = currentUser?.role === 'doctor';

  useEffect(() => {
    if (isDoctor && currentUser?.user_id) {
      loadDoctorAppointments();
      loadDoctorProfile();
    }
  }, [currentUser]);

  const loadDoctorAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getDoctorAppointments(currentUser.user_id);
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorProfile = async () => {
    try {
      const doc = await api.getDoctorById(currentUser.user_id);
      setDoctorProfile(doc);
      setProfileForm({
        availability: doc.availability,
        consultation_fee: doc.consultation_fee,
        phone: doc.phone || ''
      });
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
    }
  };

  const handleStatusUpdate = async (apptId, newStatus) => {
    const note = actionNotes[apptId] || '';
    try {
      await api.updateAppointmentStatus(apptId, newStatus, note);
      onNotify('success', `Appointment #${apptId} marked as ${newStatus}!`);
      // Clear note
      setActionNotes(prev => ({ ...prev, [apptId]: '' }));
      loadDoctorAppointments();
    } catch (err) {
      onNotify('danger', `Failed to update status: ${err.message}`);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateDoctor(currentUser.user_id, profileForm);
      onNotify('success', 'Doctor profile and availability updated successfully!');
      setIsEditingProfile(false);
      loadDoctorProfile();
    } catch (err) {
      onNotify('danger', `Profile update failed: ${err.message}`);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'All') return true;
    return a.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (!isDoctor) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 max-w-600 mx-auto bg-light">
          <div className="bg-info-subtle text-info rounded-circle p-3 d-inline-flex mx-auto mb-3" style={{ width: 64, height: 64 }}>
            <i className="bi bi-person-badge fs-2 m-auto"></i>
          </div>
          <h3 className="fw-bold mb-2">Doctor Portal Access</h3>
          <p className="text-muted small mb-4">
            Please sign in with your registered doctor credentials to manage consultation requests and patient appointments.
          </p>
          <div>
            <button
              className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm"
              onClick={() => onOpenAuth('login')}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i> Doctor Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-module container mb-5">
      {/* Doctor Header Banner */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary text-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white text-primary rounded-circle p-3 d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: 64, height: 64 }}>
              <i className="bi bi-hospital"></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-bold mb-0">{currentUser.name}</h3>
                <span className="badge bg-warning text-dark fw-bold rounded-pill">Doctor Portal</span>
              </div>
              <div className="text-white-75 small mt-1">
                {doctorProfile?.specialization} • {doctorProfile?.qualification} • {doctorProfile?.experience} Years Exp
              </div>
              <div className="text-white-50 small">
                <i className="bi bi-clock me-1"></i> Availability: {doctorProfile?.availability}
              </div>
            </div>
          </div>

          <button
            className="btn btn-outline-light btn-sm rounded-pill px-3"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            <i className="bi bi-pencil-square me-1"></i> {isEditingProfile ? 'Close Edit' : 'Edit Availability / Fee'}
          </button>
        </div>

        {/* Edit profile collapsible */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="bg-white text-dark rounded-3 p-3 mt-3 shadow-sm">
            <h6 className="fw-bold mb-2">Update Doctor Schedule & Rates</h6>
            <div className="row g-2">
              <div className="col-md-5">
                <label className="form-label small fw-semibold">Working Days & Hours</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={profileForm.availability}
                  onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                  placeholder="e.g. Mon - Fri: 09:00 AM - 02:00 PM"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Consultation Fee (₹)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={profileForm.consultation_fee}
                  onChange={(e) => setProfileForm({ ...profileForm, consultation_fee: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Contact Phone</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Appointment Controls & Status Filter */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-0">Assigned Patient Consultations</h4>
          <small className="text-muted">Review booking requests, evaluate symptoms, and confirm/reject slots</small>
        </div>

        {/* Filters */}
        <div className="btn-group bg-light p-1 rounded-pill border">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                statusFilter === status ? 'btn-primary text-white shadow-sm' : 'text-secondary'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
              {status === 'Pending' && appointments.filter(a => a.status === 'Pending').length > 0 && (
                <span className="badge bg-danger ms-1">
                  {appointments.filter(a => a.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-light">
          <i className="bi bi-calendar-check fs-1 text-muted mb-2"></i>
          <h5 className="fw-bold">No Appointments Found</h5>
          <p className="text-muted small">No patient bookings match the selected status filter.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: 48, height: 48 }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">
                        {appt.user?.name || `Patient #${appt.user_id}`}
                      </h5>
                      <div className="small text-muted">
                        <i className="bi bi-telephone me-1"></i>{appt.user?.phone || 'No phone'} • 
                        <i className="bi bi-envelope ms-2 me-1"></i>{appt.user?.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge rounded-pill px-3 py-2 text-uppercase fs-8 ${
                      appt.status === 'Confirmed'
                        ? 'bg-success text-white'
                        : appt.status === 'Pending'
                        ? 'bg-warning text-dark'
                        : appt.status === 'Rejected'
                        ? 'bg-danger text-white'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* Consultation Details */}
                <div className="bg-light rounded-3 p-3 mb-3 small">
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <span className="text-muted">Appointment Date:</span>
                      <div className="fw-bold text-dark">{appt.date}</div>
                    </div>
                    <div className="col-6">
                      <span className="text-muted">Time Slot:</span>
                      <div className="fw-bold text-dark">{appt.time}</div>
                    </div>
                  </div>
                  <div className="border-top pt-2">
                    <span className="text-muted fw-semibold">Reported Patient Symptoms:</span>
                    <div className="text-dark mt-1 p-2 bg-white rounded border">
                      {appt.symptoms || 'Patient did not describe specific symptoms.'}
                    </div>
                  </div>
                  {appt.notes && (
                    <div className="mt-2 text-info">
                      <span className="fw-semibold">Recorded Doctor Note:</span>
                      <div className="text-dark fst-italic">{appt.notes}</div>
                    </div>
                  )}
                </div>

                {/* Action Form / Note Input */}
                {appt.status === 'Pending' && (
                  <div className="mt-auto">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add optional note/instructions for patient..."
                        value={actionNotes[appt.id] || ''}
                        onChange={(e) => setActionNotes({ ...actionNotes, [appt.id]: e.target.value })}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm flex-grow-1 rounded-pill fw-semibold shadow-sm"
                        onClick={() => handleStatusUpdate(appt.id, 'Confirmed')}
                      >
                        <i className="bi bi-check-circle-fill me-1"></i> Accept & Confirm
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm flex-grow-1 rounded-pill fw-semibold"
                        onClick={() => handleStatusUpdate(appt.id, 'Rejected')}
                      >
                        <i className="bi bi-x-circle-fill me-1"></i> Reject Slot
                      </button>
                    </div>
                  </div>
                )}

                {appt.status === 'Confirmed' && (
                  <div className="mt-auto d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                      onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                    >
                      <i className="bi bi-check2-all me-1"></i> Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
