import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CrimeForm from './components/CrimeForm';
import MapView from './components/MapView';
import PredictionDashboard from './components/PredictionDashboard';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        fontFamily: "Segoe UI, Arial, sans-serif"
      }}>
        <nav style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          padding: "1.5rem 0",
          background: "#312e81",
          color: "#fff",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(49,46,129,0.08)"
        }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>Crime Form</Link>
          <Link to="/map" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>Map View</Link>
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>Dashboard</Link>
        </nav>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(49,46,129,0.10)",
          padding: "2rem"
        }}>
          <Routes>
            <Route path="/" element={<CrimeForm />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/dashboard" element={<PredictionDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;