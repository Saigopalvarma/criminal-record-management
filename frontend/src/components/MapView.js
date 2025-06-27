import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Cluster colors
const clusterColors = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];

// Human-readable descriptions
const clusterDescriptions = {
  0: "Downtown Area",
  1: "University District",
  2: "Industrial Zone",
  3: "Residential East",
  4: "Commercial West",
  5: "Parks & Recreational",
  6: "Airport Vicinity",
  7: "Suburban South",
  8: "Harbor Region",
  9: "Outer Boundary",
};

// Default icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Cluster custom icon
function createClusterCustomIcon(cluster) {
  const firstMarker = cluster.getAllChildMarkers()[0];
  const clusterId = firstMarker?.options?.clusterId ?? 0;
  const color = clusterColors[clusterId % clusterColors.length];

  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      border: 2px solid white;">
      ${cluster.getChildCount()}
    </div>`,
    className: "custom-marker-cluster",
    iconSize: L.point(32, 32, true),
  });
}

export default function MapView() {
  const [crimeData, setCrimeData] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState("All");

  useEffect(() => {
    fetch("/combined_clustered_crimes.json")
      .then((res) => res.json())
      .then((data) => {
        const enhanced = data.map((item, idx) => ({
          ...item,
          clusterId: item.Cluster ?? 0,
          id: idx,
        }));
        setCrimeData(enhanced);
      });
  }, []);

  const clusterSummaries = crimeData.reduce((acc, crime) => {
    const cluster = crime.Cluster;
    if (!acc[cluster]) acc[cluster] = { total: 0, crimes: {} };
    acc[cluster].total += 1;
    acc[cluster].crimes[crime["Crime Type"]] =
      (acc[cluster].crimes[crime["Crime Type"]] || 0) + 1;
    return acc;
  }, {});

  // Add top 2 crimes
  Object.entries(clusterSummaries).forEach(([cl, data]) => {
    const sorted = Object.entries(data.crimes).sort((a, b) => b[1] - a[1]);
    clusterSummaries[cl].topCrimes = sorted.slice(0, 2).map((x) => x[0]);
  });

  const filteredData =
    selectedCluster === "All"
      ? crimeData
      : crimeData.filter((c) => `${c.Cluster}` === selectedCluster);

  const info = selectedCluster !== "All" ? clusterSummaries[selectedCluster] : null;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Left: Map + Dropdown */}
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        {/* Dropdown */}
        <div style={{
          padding: "10px 15px",
          background: "#fff",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            Filter by Cluster:
          </label>
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              background: "#f4f4f4",
              cursor: "pointer"
            }}
          >
            <option value="All">All Clusters</option>
            {Object.entries(clusterSummaries).map(([cl, d]) => (
              <option key={cl} value={cl}>
                Cluster {cl} – {d.total} crimes
              </option>
            ))}
          </select>
        </div>

        {/* Map */}
        <MapContainer
          center={[47.6062, -122.3321]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ flexGrow: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
            {filteredData.map((crime, idx) => (
              <Marker
                key={idx}
                position={[crime.Latitude, crime.Longitude]}
                icon={defaultIcon}
                clusterId={crime.Cluster}
              >
                <Popup>
                  <strong>Crime:</strong> {crime["Crime Type"]}<br />
                  <strong>Cluster:</strong> {crime.Cluster}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Right: Description Box */}
      <div style={{
        width: "300px",
        background: "#fafafa",
        borderLeft: "1px solid #ddd",
        padding: "20px"
      }}>
        <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Cluster Info</h2>
        {selectedCluster === "All" ? (
          <p style={{ color: "#666" }}>Select a cluster to view details.</p>
        ) : (
          <>
            <p><strong>Cluster:</strong> {selectedCluster}</p>
            <p><strong>Area:</strong> {clusterDescriptions[selectedCluster] || "Unknown"}</p>
            <p><strong>Total Crimes:</strong> {info?.total}</p>
            <p><strong>Top Crimes:</strong></p>
            <ul>
              {info?.topCrimes.map((type, i) => (
                <li key={i}>{type}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
