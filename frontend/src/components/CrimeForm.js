import React, { useState } from "react";
import axios from "axios";

const initialForm = {
  age: "",
  juv_fel_count: "",
  juv_misd_count: "",
  juv_other_count: "",
  priors_count: "",
  sex: "",
  race: "",
  c_charge_degree: "",
  age_bucket: "",
  priors_bucket: ""
};

const sexOptions = ["Male", "Female"];
const raceOptions = ["African-American", "Asian", "Caucasian", "Hispanic", "Other"];
const chargeDegreeOptions = ["F", "M"];
const ageBucketOptions = ["<25", "25-45", ">45"];
const priorsBucketOptions = ["0", "1-5", "6-10", "11+"];

function CrimeForm() {
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);

    // Convert numeric fields to numbers
    const payload = {
      ...form,
      age: Number(form.age),
      juv_fel_count: Number(form.juv_fel_count),
      juv_misd_count: Number(form.juv_misd_count),
      juv_other_count: Number(form.juv_other_count),
      priors_count: Number(form.priors_count)
    };

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", payload);
      setPrediction(res.data.reoffend_prediction);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Prediction failed. Please check your input and try again."
      );
    }
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: "auto",
      background: "#f3f4f6",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(49,46,129,0.10)",
      padding: "2.5rem 2rem",
      marginTop: "2rem"
    }}>
      <h2 style={{
        textAlign: "center",
        color: "#312e81",
        marginBottom: "1.5rem",
        letterSpacing: "1px"
      }}>Recidivism Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ fontWeight: 500 }}>
            Age:
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
              min={0}
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "60%"
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Juvenile Felony Count:
            <input
              name="juv_fel_count"
              type="number"
              value={form.juv_fel_count}
              onChange={handleChange}
              required
              min={0}
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "60%"
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Juvenile Misdemeanor Count:
            <input
              name="juv_misd_count"
              type="number"
              value={form.juv_misd_count}
              onChange={handleChange}
              required
              min={0}
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "60%"
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Juvenile Other Count:
            <input
              name="juv_other_count"
              type="number"
              value={form.juv_other_count}
              onChange={handleChange}
              required
              min={0}
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "60%"
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Priors Count:
            <input
              name="priors_count"
              type="number"
              value={form.priors_count}
              onChange={handleChange}
              required
              min={0}
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "60%"
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Sex:
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              required
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "65%"
              }}
            >
              <option value="">Select</option>
              {sexOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 500 }}>
            Race:
            <select
              name="race"
              value={form.race}
              onChange={handleChange}
              required
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "65%"
              }}
            >
              <option value="">Select</option>
              {raceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 500 }}>
            Charge Degree:
            <select
              name="c_charge_degree"
              value={form.c_charge_degree}
              onChange={handleChange}
              required
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "65%"
              }}
            >
              <option value="">Select</option>
              {chargeDegreeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 500 }}>
            Age Bucket:
            <select
              name="age_bucket"
              value={form.age_bucket}
              onChange={handleChange}
              required
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "65%"
              }}
            >
              <option value="">Select</option>
              {ageBucketOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 500 }}>
            Priors Bucket:
            <select
              name="priors_bucket"
              value={form.priors_bucket}
              onChange={handleChange}
              required
              style={{
                marginLeft: 10,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #c7d2fe",
                width: "65%"
              }}
            >
              <option value="">Select</option>
              {priorsBucketOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
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
              transition: "background 0.2s"
            }}
          >
            Predict
          </button>
        </div>
      </form>
      {prediction !== null && (
        <div style={{
          marginTop: 24,
          background: prediction === 1 ? "#fee2e2" : "#d1fae5",
          color: prediction === 1 ? "#991b1b" : "#065f46",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.1rem"
        }}>
          Prediction: {prediction === 1 ? "Will reoffend" : "Will not reoffend"}
        </div>
      )}
      {error && (
        <div style={{
          color: "#b91c1c",
          background: "#fee2e2",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: 20,
          textAlign: "center"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default CrimeForm;