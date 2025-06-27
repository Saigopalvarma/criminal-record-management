import React, { useState } from "react";
import axios from "axios";

function PredictionDashboard() {
  const [description, setDescription] = useState("");
  const [crimeType, setCrimeType] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCrimeType(null);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict_crime_type", {
        description,
      });
      setCrimeType(res.data.crime_type);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Prediction failed. Please check your input and try again."
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        background: "#f3f4f6",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(49,46,129,0.10)",
        padding: "2.5rem 2rem",
        marginTop: "2rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#312e81",
          marginBottom: "1.5rem",
          letterSpacing: "1px",
        }}
      >
        Crime Type Prediction
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ fontWeight: 500 }}>
            Crime Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              style={{
                marginLeft: 10,
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "90%",
                resize: "vertical",
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: "1.5rem",
              background: "#312e81",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7rem 1.5rem",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(49,46,129,0.08)",
              transition: "background 0.2s",
            }}
          >
            Predict Crime Type
          </button>
        </div>
      </form>
      {crimeType && (
        <div
          style={{
            marginTop: 24,
            background: "#dbeafe",
            color: "#1e40af",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          Predicted Crime Type: {crimeType}
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            borderRadius: "8px",
            padding: "1rem",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default PredictionDashboard;