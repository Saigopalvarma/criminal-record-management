import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
import matplotlib.pyplot as plt
import json

# Load Chicago dataset
chicago = pd.read_csv("D:/mini-project-3/backend/data/geo_location.csv")

# Select and rename necessary columns
chicago = chicago[['LAT', 'LON', 'Crm Cd Desc']].dropna()
chicago.rename(columns={'LAT': 'Latitude', 'LON': 'Longitude', 'Crm Cd Desc': 'Crime Type'}, inplace=True)

# Sample 25k rows
chicago_sample = chicago.sample(25000, random_state=42)

# Encode 'Crime Type'
le = LabelEncoder()
chicago_sample['crime_type_encoded'] = le.fit_transform(chicago_sample['Crime Type'])

# Prepare features
X = chicago_sample[['Latitude', 'Longitude', 'crime_type_encoded']]

# Elbow method (optional)
inertias = []
K_range = range(2, 11)
for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

# Plot and save elbow curve
plt.figure(figsize=(8,5))
plt.plot(K_range, inertias, marker='o')
plt.xlabel('Number of clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal k')
plt.grid(True)
plt.savefig("elbow_chicago.png")
plt.close()

# Fit KMeans with k=4
k_optimal = 4
kmeans = KMeans(n_clusters=k_optimal, random_state=42, n_init=10)
chicago_sample['Cluster'] = kmeans.fit_predict(X)

# Evaluation metrics
sil_score = silhouette_score(X, chicago_sample['Cluster'])
db_score = davies_bouldin_score(X, chicago_sample['Cluster'])
ch_score = calinski_harabasz_score(X, chicago_sample['Cluster'])

print(f"Silhouette Score: {sil_score:.4f}")
print(f"Davies-Bouldin Index: {db_score:.4f}")
print(f"Calinski-Harabasz Score: {ch_score:.2f}")

# Remove cluster 3 (sea cluster)
removed_count = (chicago_sample['Cluster'] == 3).sum()
filtered = chicago_sample[chicago_sample['Cluster'] != 3]

# Save filtered result
output = filtered[['Latitude', 'Longitude', 'Crime Type', 'Cluster']].to_dict(orient='records')
with open("combined_clustered_crimes.json", "w") as f:
    json.dump(output, f, indent=2)

print(f"Removed {removed_count} points from Cluster 3 (sea cluster)")
print("Clustered Chicago crime data saved to combined_clustered_crimes.json")
