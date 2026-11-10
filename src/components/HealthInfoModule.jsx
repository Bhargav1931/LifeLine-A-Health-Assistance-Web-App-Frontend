import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function HealthInfoModule({ onNotify }) {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);

  // BMI State
  const [weight, setWeight] = useState(68);
  const [height, setHeight] = useState(172);
  const [bmiResult, setBmiResult] = useState(null);
  const [calculatingBmi, setCalculatingBmi] = useState(false);

  useEffect(() => {
    loadArticles();
    loadHelplines();
    // compute default BMI
    handleCalculateBMI(68, 172);
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await api.getArticles(selectedCategory);
      setArticles(data);
    } catch (err) {
      console.error('Error loading health articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHelplines = async () => {
    try {
      const data = await api.getEmergencyContacts();
      setHelplines(data);
    } catch (err) {
      console.error('Error loading helplines:', err);
    }
  };

  const handleCalculateBMI = async (w = weight, h = height) => {
    if (!w || !h || w <= 0 || h <= 0) return;
    setCalculatingBmi(true);
    try {
      const result = await api.calculateBMI(parseFloat(w), parseFloat(h));
      setBmiResult(result);
    } catch (err) {
      console.error('BMI calculation error:', err);
    } finally {
      setCalculatingBmi(false);
    }
  };

  const copyToClipboard = (text, name) => {
    navigator.clipboard.writeText(text);
    onNotify('success', `Copied ${name} (${text}) to clipboard!`);
  };

  return (
    <div className="health-module container mb-5">
      {/* Title */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <span className="badge bg-danger-subtle text-danger p-2 rounded-circle fs-5">
              <i className="bi bi-heart-pulse-fill"></i>
            </span>
            <span>Health Info & Emergency Module</span>
          </h2>
          <p className="text-muted mb-0 small">
            Access immediate life-saving first-aid guidelines, calculate your Body Mass Index (BMI), and reach 24/7 national emergency helplines.
          </p>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 1: EMERGENCY HELPLINE DIRECTORY */}
      {/* ==================================================================== */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2 text-danger">
            <i className="bi bi-shield-fill-exclamation"></i>
            <span>Emergency SOS & National Helplines</span>
          </h4>
          <span className="badge bg-danger text-white px-3 py-1 rounded-pill">
            24x7 Toll Free
          </span>
        </div>

        <div className="row g-3">
          {helplines.map((item, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-start border-danger border-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0 text-dark">{item.name}</h6>
                  <span className="badge bg-danger fs-6 fw-bold px-2 py-1 rounded-pill">
                    {item.number}
                  </span>
                </div>
                <p className="small text-muted mb-3">{item.service}</p>
                <div className="d-flex gap-2 mt-auto">
                  <a
                    href={`tel:${item.number}`}
                    className="btn btn-danger btn-sm rounded-pill flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="bi bi-telephone-fill"></i>
                    <span>Call Now</span>
                  </a>
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    onClick={() => copyToClipboard(item.number, item.name)}
                    title="Copy number"
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: INTERACTIVE BMI CALCULATOR */}
      {/* ==================================================================== */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-gradient-light">
        <div className="row align-items-center g-4">
          <div className="col-lg-5 border-end-lg">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-success-subtle text-success p-2 rounded-circle fs-5">
                <i className="bi bi-calculator"></i>
              </span>
              <div>
                <h4 className="fw-bold mb-0">Interactive BMI Calculator</h4>
                <small className="text-muted">Formula: Weight (kg) / [Height (m)]²</small>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCalculateBMI();
              }}
            >
              {/* Weight */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <label>Weight (kg):</label>
                  <span className="text-primary fw-bold">{weight} kg</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="30"
                  max="160"
                  step="0.5"
                  value={weight}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value);
                    setWeight(w);
                    handleCalculateBMI(w, height);
                  }}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={weight}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value) || 0;
                    setWeight(w);
                    handleCalculateBMI(w, height);
                  }}
                />
              </div>

              {/* Height */}
              <div className="mb-4">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <label>Height (cm):</label>
                  <span className="text-primary fw-bold">{height} cm ({(height / 100).toFixed(2)} m)</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="100"
                  max="220"
                  step="1"
                  value={height}
                  onChange={(e) => {
                    const h = parseFloat(e.target.value);
                    setHeight(h);
                    handleCalculateBMI(weight, h);
                  }}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={height}
                  onChange={(e) => {
                    const h = parseFloat(e.target.value) || 0;
                    setHeight(h);
                    handleCalculateBMI(weight, h);
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 rounded-pill fw-bold shadow-sm"
                disabled={calculatingBmi}
              >
                {calculatingBmi ? 'Calculating...' : 'Recalculate BMI Score'}
              </button>
            </form>
          </div>

          {/* BMI Result Display */}
          <div className="col-lg-7">
            {bmiResult ? (
              <div className="p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small fw-semibold">Your Clinical Assessment</span>
                  <span
                    className={`badge px-3 py-2 rounded-pill fs-7 fw-bold ${
                      bmiResult.category.includes('Normal')
                        ? 'bg-success text-white'
                        : bmiResult.category.includes('Underweight')
                        ? 'bg-info text-dark'
                        : bmiResult.category.includes('Overweight')
                        ? 'bg-warning text-dark'
                        : 'bg-danger text-white'
                    }`}
                  >
                    {bmiResult.category}
                  </span>
                </div>

                <div className="d-flex align-items-baseline gap-3 mb-3">
                  <div className="display-3 fw-extrabold text-dark">{bmiResult.bmi}</div>
                  <div className="text-muted small">kg/m²</div>
                </div>

                {/* Gauge bar */}
                <div className="progress mb-3" style={{ height: 12 }}>
                  <div className="progress-bar bg-info" style={{ width: '25%' }} title="Underweight (< 18.5)"></div>
                  <div className="progress-bar bg-success" style={{ width: '30%' }} title="Normal (18.5 - 24.9)"></div>
                  <div className="progress-bar bg-warning" style={{ width: '25%' }} title="Overweight (25 - 29.9)"></div>
                  <div className="progress-bar bg-danger" style={{ width: '20%' }} title="Obese (30+)"></div>
                </div>
                <div className="d-flex justify-content-between text-muted fs-8 mb-4">
                  <span>Underweight (&lt;18.5)</span>
                  <span className="fw-bold text-success">Normal (18.5-24.9)</span>
                  <span>Overweight (25-29.9)</span>
                  <span>Obese (30+)</span>
                </div>

                <div className="bg-white rounded-3 p-3 border mb-2">
                  <div className="fw-semibold small text-danger mb-1">
                    <i className="bi bi-shield-exclamation me-1"></i> Health Risk:
                  </div>
                  <div className="small text-dark mb-2">{bmiResult.risk_level}</div>

                  <div className="fw-semibold small text-primary mb-1">
                    <i className="bi bi-lightbulb-fill me-1"></i> Medical Recommendation:
                  </div>
                  <div className="small text-dark">{bmiResult.recommendation}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: FIRST AID & HEALTH ARTICLES */}
      {/* ==================================================================== */}
      <div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-journal-medical text-primary"></i>
              <span>Life-Saving First-Aid & Health Articles</span>
            </h4>
            <small className="text-muted">Standard clinical emergency guidelines and daily preventive health habits</small>
          </div>

          {/* Category filter */}
          <div className="btn-group bg-light p-1 rounded-pill border">
            {['All', 'First Aid', 'Emergency', 'General Health'].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                  selectedCategory === cat ? 'btn-primary text-white shadow-sm' : 'text-secondary'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading guides...</p>
          </div>
        ) : (
          <div className="row g-4">
            {articles.map((art) => (
              <div key={art.id} className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                      {art.category}
                    </span>
                    {art.emergency_contact && (
                      <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">
                        <i className="bi bi-telephone-fill me-1"></i> SOS: {art.emergency_contact}
                      </span>
                    )}
                  </div>
                  <h5 className="fw-bold mb-2 text-dark">{art.title}</h5>
                  <div className="small text-secondary mb-3" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {art.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
