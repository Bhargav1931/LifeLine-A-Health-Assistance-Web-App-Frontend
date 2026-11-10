// Base URL configured from environment (e.g. Render production or dev proxy)
// Trims any trailing slashes to guarantee clean endpoint resolution
const rawBaseUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorMsg = response.statusText || `HTTP Error ${response.status}`;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // System Health
  checkHealth: () => fetch(`${API_BASE_URL}/health`).then(handleResponse),

  // Auth & Testing Accounts
  getTestUsers: () => fetch(`${API_BASE_URL}/auth/test-users`).then(handleResponse),
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),
  register: (userData) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse),

  // User Module
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(handleResponse),
  getUserProfile: (userId) => fetch(`${API_BASE_URL}/users/${userId}`).then(handleResponse),
  updateUserProfile: (userId, data) =>
    fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteUser: (userId) =>
    fetch(`${API_BASE_URL}/users/${userId}`, { method: 'DELETE' }).then(handleResponse),

  // Doctor Module
  getDoctors: (specialization = '') => {
    const url = specialization && specialization !== 'All'
      ? `${API_BASE_URL}/doctors?specialization=${encodeURIComponent(specialization)}`
      : `${API_BASE_URL}/doctors`;
    return fetch(url).then(handleResponse);
  },
  getSpecializations: () => fetch(`${API_BASE_URL}/doctors/specializations`).then(handleResponse),
  getDoctorById: (doctorId) => fetch(`${API_BASE_URL}/doctors/${doctorId}`).then(handleResponse),
  addDoctor: (doctorData) =>
    fetch(`${API_BASE_URL}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData),
    }).then(handleResponse),
  updateDoctor: (doctorId, data) =>
    fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteDoctor: (doctorId) =>
    fetch(`${API_BASE_URL}/doctors/${doctorId}`, { method: 'DELETE' }).then(handleResponse),

  // Appointment Module
  getAppointments: (status = '') => {
    const url = status && status !== 'All'
      ? `${API_BASE_URL}/appointments?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/appointments`;
    return fetch(url).then(handleResponse);
  },
  getUserAppointments: (userId) =>
    fetch(`${API_BASE_URL}/appointments/user/${userId}`).then(handleResponse),
  getDoctorAppointments: (doctorId) =>
    fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}`).then(handleResponse),
  getBookedSlots: (doctorId, date) =>
    fetch(`${API_BASE_URL}/appointments/booked-slots/${doctorId}/${date}`).then(handleResponse),
  bookAppointment: (userId, appointmentData) =>
    fetch(`${API_BASE_URL}/appointments?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    }).then(handleResponse),
  updateAppointmentStatus: (appointmentId, status, notes = '') =>
    fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    }).then(handleResponse),
  cancelAppointment: (appointmentId) =>
    fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
    }).then(handleResponse),
  deleteAppointment: (appointmentId) =>
    fetch(`${API_BASE_URL}/appointments/${appointmentId}`, { method: 'DELETE' }).then(handleResponse),

  // Health Info Module
  getArticles: (category = '') => {
    const url = category && category !== 'All'
      ? `${API_BASE_URL}/health-articles?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/health-articles`;
    return fetch(url).then(handleResponse);
  },
  createArticle: (articleData) =>
    fetch(`${API_BASE_URL}/health-articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    }).then(handleResponse),
  deleteArticle: (articleId) =>
    fetch(`${API_BASE_URL}/health-articles/${articleId}`, { method: 'DELETE' }).then(handleResponse),
  calculateBMI: (weight_kg, height_cm) =>
    fetch(`${API_BASE_URL}/health/bmi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight_kg, height_cm }),
    }).then(handleResponse),
  getEmergencyContacts: () =>
    fetch(`${API_BASE_URL}/health/emergency-contacts`).then(handleResponse),

  // Admin Module
  getAdminStats: () => fetch(`${API_BASE_URL}/admin/stats`).then(handleResponse),
};
