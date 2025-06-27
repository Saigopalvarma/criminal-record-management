## 🤖 **Model Details**

### 🔠 **1. BERT Crime Classifier**

- **Purpose**: Classify crime reports into predefined categories.
- **Training Script**: `backend/train_bert_classifier.py`
- **Usage**: Loaded in `crime_classifier.py` and served via `/predict_crime_type` API route.

---

### 🔢 **2. LightGBM Reoffend Predictor**

- **Purpose**: Predict the likelihood of a criminal reoffending based on COMPAS dataset features.
- **Model Used**: LightGBM for efficient gradient boosting and faster training compared to XGBoost.
- **Training Script**: Included in `train_models.py`
- **Usage**: Served via `/predict_reoffend` API route.

---

### 🗺️ **3. KMeans Geo Clustering**

- **Purpose**: Cluster crime data based on geo-coordinates for visualization.
- **Training Script**: Included in `train_models.py`
- **Usage**: Served via `/geo_clusters` API route.

---

## 🖥️ **Tech Stack**

- **Frontend**: React.js
- **Backend**: Flask (Python)

- **ML Models**:
  - **BERT**: For crime type classification
  - **LightGBM**: For reoffending risk prediction
  - **KMeans**: For geo-location clustering
- **Data**: COMPAS dataset for training models
