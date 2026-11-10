import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM"
];

export default function UserModule({
  currentUser,
  onOpenAuth,
  onNotify
}) {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('book'); // 'book' or 'history'

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Fetch doctors and specializations
  useEffect(() => {
    loadDoctors();
    loadSpecializations();
  }, [selectedSpec]);

  // Fetch user appointments if logged in
  useEffect(() => {
    if (currentUser?.user_id) {
      loadUserAppointments();
    }
  }, [currentUser]);

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const data = await api.getDoctors(selectedSpec);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const loadSpecializations = async () => {
    try {
      const data = await api.getSpecializations();
      setSpecializations(['All', ...data]);
    } catch (err) {
      console.error('Error fetching specializations:', err);
    }
  };

  const loadUserAppointments = async () => {
    if (!currentUser?.user_id) return;
    setLoadingAppts(true);
    try {
      const data = await api.getUserAppointments(currentUser.user_id);
      setUserAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoadingAppts(false);
    }
  };

  // When doctor or booking date changes, fetch booked slots to show availability
  useEffect(() => {
    if (selectedDoctor && bookingDate) {
      api.getBookedSlots(selectedDoctor.id, bookingDate)
        .then(slots => setBookedSlots(slots))
        .catch(err => console.error('Failed to fetch booked slots:', err));
    }
  }, [selectedDoctor, bookingDate]);

  const handleOpenBookingModal = (doctor) => {
    if (!currentUser) {
      onNotify('warning', 'Please log in as a Patient to book an appointment.');
      onOpenAuth();
      return;
    }
    setSelectedDoctor(doctor);
    setBookingTime('');
    setSymptoms('');
    setBookingError(null);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingTime) {
      setBookingError('Please select a time slot.');
      return;
    }

    setSubmittingBooking(true);
    setBookingError(null);

    try {
      const res = await api.bookAppointment(currentUser.user_id, {
        doctor_id: selectedDoctor.id,
        date: bookingDate,
        time: bookingTime,
        symptoms: symptoms || 'General consultation request'
      });

      onNotify('success', `Appointment successfully scheduled with ${selectedDoctor.name} on ${bookingDate} at ${bookingTime}!`);
      setSelectedDoctor(null);
      loadUserAppointments();
      setActiveSubTab('history');
    } catch (err) {
      // Viva highlight: Unique constraint conflict
      setBookingError(err.message || 'Slot conflict or booking error');
      onNotify('danger', `Booking Failed: ${err.message}`);
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.cancelAppointment(apptId);
      onNotify('info', 'Appointment cancelled successfully.');
      loadUserAppointments();
    } catch (err) {
      onNotify('danger', `Cancellation failed: ${err.message}`);
    }
  };

  // Filter doctors by search query
  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-module container mb-5">
      {/* Module Title & Navigation */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary p-2 rounded-circle fs-5">
              <i className="bi bi-people-fill"></i>
            </span>
            <span>User & Patient Module</span>
          </h2>
          <p className="text-muted mb-0 small">
            Find certified doctors by specialization, book verified consultation slots, and track history.
          </p>
        </div>

        {/* Tab switch */}
        <div className="btn-group bg-light p-1 rounded-pill border">
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              activeSubTab === 'book' ? 'btn-primary text-white shadow-sm' : 'text-secondary'
            }`}
            onClick={() => setActiveSubTab('book')}
          >
            <i className="bi bi-search me-1"></i> Find Doctors
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              activeSubTab === 'history' ? 'btn-primary text-white shadow-sm' : 'text-secondary'
            }`}
            onClick={() => {
              if (!currentUser) {
                onNotify('warning', 'Please login to view appointment history.');
                onOpenAuth();
              } else {
                setActiveSubTab('history');
              }
            }}
          >
            <i className="bi bi-clock-history me-1"></i> My Appointments
            {userAppointments.length > 0 && (
              <span className="badge bg-danger ms-1">{userAppointments.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: FIND DOCTORS & BOOK */}
      {/* ==================================================================== */}
      {activeSubTab === 'book' && (
        <div>
          {/* Search & Specialization Filters */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search doctor name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-7">
                <div className="d-flex flex-wrap gap-1 align-items-center">
                  <span className="small text-muted me-1 fw-semibold">Specialization:</span>
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      className={`btn btn-sm rounded-pill px-3 py-1 ${
                        selectedSpec === spec
                          ? 'btn-primary shadow-sm'
                          : 'btn-outline-secondary bg-white'
                      }`}
                      onClick={() => setSelectedSpec(spec)}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Cards Grid */}
          {loadingDoctors ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 small">Loading specialists...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="alert alert-info text-center py-4 rounded-4">
              <i className="bi bi-info-circle fs-3 d-block mb-2"></i>
              No doctors found matching your criteria. Try selecting another specialization.
            </div>
          ) : (
            <div className="row g-4">
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm rounded-4 doctor-card overflow-hidden transition-all">
                    <div className="card-body p-4 d-flex flex-column">
                      {/* Doctor Header */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="doc-avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 56, height: 56 }}>
                          {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h5 className="card-title fw-bold mb-0 text-dark">{doc.name}</h5>
                          <span className="badge bg-primary text-white rounded-pill px-2 py-1 mt-1 small">
                            {doc.specialization}
                          </span>
                        </div>
                      </div>

                      {/* Doctor Specs */}
                      <div className="bg-light rounded-3 p-3 mb-3 small">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted"><i className="bi bi-mortarboard me-1"></i> Degree:</span>
                          <span className="fw-semibold">{doc.qualification}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted"><i className="bi bi-briefcase me-1"></i> Experience:</span>
                          <span className="fw-semibold">{doc.experience} Years</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted"><i className="bi bi-clock me-1"></i> Timing:</span>
                          <span className="fw-semibold text-truncate" style={{ maxWidth: '160px' }}>
                            {doc.availability}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between border-top pt-2 mt-2">
                          <span className="text-muted"><i className="bi bi-cash me-1"></i> Fee:</span>
                          <span className="fw-bold text-success fs-6">₹{doc.consultation_fee}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        className="btn btn-primary w-100 mt-auto rounded-pill py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleOpenBookingModal(doc)}
                      >
                        <i className="bi bi-calendar2-plus-fill"></i>
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: MY APPOINTMENTS */}
      {/* ==================================================================== */}
      {activeSubTab === 'history' && (
        <div>
          {!currentUser ? (
            <div className="text-center py-5">
              <p className="text-muted">Please sign in to view your appointment history.</p>
              <button className="btn btn-primary rounded-pill px-4" onClick={onOpenAuth}>
                Sign In
              </button>
            </div>
          ) : loadingAppts ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading your appointments...</p>
            </div>
          ) : userAppointments.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-light">
              <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
              <h5 className="fw-bold">No Appointments Yet</h5>
              <p className="text-muted small">You haven't booked any doctor appointments yet.</p>
              <button
                className="btn btn-primary rounded-pill px-4 mt-2 mx-auto"
                onClick={() => setActiveSubTab('book')}
              >
                Browse Doctors & Book Now
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {userAppointments.map((appt) => (
                <div key={appt.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-light text-secondary border me-2">
                          #{appt.id}
                        </span>
                        <h5 className="fw-bold mb-0 d-inline text-dark">
                          {appt.doctor?.name || `Doctor #${appt.doctor_id}`}
                        </h5>
                        <div className="text-primary small fw-semibold mt-1">
                          {appt.doctor?.specialization || 'Medical Specialist'}
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

                    <div className="row g-2 mb-3 bg-light rounded-3 p-3 small">
                      <div className="col-6">
                        <div className="text-muted"><i className="bi bi-calendar-event me-1"></i> Date</div>
                        <div className="fw-bold">{appt.date}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted"><i className="bi bi-clock me-1"></i> Time Slot</div>
                        <div className="fw-bold">{appt.time}</div>
                      </div>
                      <div className="col-12 mt-2 pt-2 border-top">
                        <div className="text-muted"><i className="bi bi-chat-left-text me-1"></i> Symptoms Reported:</div>
                        <div className="text-dark">{appt.symptoms || 'None specified'}</div>
                      </div>
                      {appt.notes && (
                        <div className="col-12 mt-1">
                          <div className="text-info fw-semibold"><i className="bi bi-info-circle me-1"></i> Doctor's Note:</div>
                          <div className="text-dark fst-italic">{appt.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-end gap-2 mt-auto">
                      {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleCancelAppointment(appt.id)}
                        >
                          <i className="bi bi-x-circle me-1"></i> Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* APPOINTMENT BOOKING MODAL */}
      {/* ==================================================================== */}
      {selectedDoctor && (
        <div className="modal show d-block fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 px-4 py-3">
                <div>
                  <h5 className="modal-title fw-bold mb-0">Book Doctor Consultation</h5>
                  <small className="text-white-75">Confirms conflict-free slot booking</small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedDoctor(null)}
                ></button>
              </div>

              <form onSubmit={handleBookAppointment}>
                <div className="modal-body p-4">
                  {/* Doctor Info Brief */}
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: 44, height: 44 }}>
                      <i className="bi bi-heart-pulse"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{selectedDoctor.name}</h6>
                      <small className="text-muted">{selectedDoctor.specialization} • Fee: ₹{selectedDoctor.consultation_fee}</small>
                      <div className="small text-secondary"><i className="bi bi-clock me-1"></i>{selectedDoctor.availability}</div>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small">
                      <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                      <div>{bookingError}</div>
                    </div>
                  )}

                  {/* Date Selection */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Appointment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Time Slot Selection */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold d-flex justify-content-between">
                      <span>Available Time Slots</span>
                      <span className="text-muted small">
                        {bookedSlots.length > 0 ? `${bookedSlots.length} slot(s) already reserved` : 'All slots open'}
                      </span>
                    </label>

                    <div className="row g-2">
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <div key={slot} className="col-4">
                            <button
                              type="button"
                              disabled={isBooked}
                              className={`btn btn-sm w-100 py-2 rounded-3 fw-semibold ${
                                isBooked
                                  ? 'btn-light text-muted border border-dashed text-decoration-line-through'
                                  : bookingTime === slot
                                  ? 'btn-primary shadow-sm text-white'
                                  : 'btn-outline-primary bg-white'
                              }`}
                              onClick={() => setBookingTime(slot)}
                            >
                              {slot}
                              {isBooked && <div className="fs-9 text-danger">Booked</div>}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <small className="text-muted mt-1 d-block">
                      * Conflict prevention rule: Unique constraint on Doctor + Date + Time.
                    </small>
                  </div>

                  {/* Symptoms / Reason */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Symptoms or Reason for Consultation</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. Experiencing fever for 2 days, chest discomfort, or need general checkup..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light border-0 px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                    disabled={submittingBooking || !bookingTime}
                  >
                    {submittingBooking ? 'Confirming...' : 'Confirm Appointment Booking'}
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
