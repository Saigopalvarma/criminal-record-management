import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import lightgbm as lgb
import numpy as np
import joblib
# Load data
df = pd.read_csv('data/compas-scores-two-years.csv')

# Feature engineering: add age and priors buckets
df['age_bucket'] = pd.cut(df['age'], bins=[0, 25, 45, 100], labels=['<25', '25-45', '>45'])
df['priors_bucket'] = pd.cut(df['priors_count'], bins=[-1, 0, 5, 10, 100], labels=['0', '1-5', '6-10', '11+'])

# Only keep features available at screening
keep_cols = [
    'age', 'juv_fel_count', 'juv_misd_count', 'juv_other_count',
    'priors_count', 'c_charge_degree', 'sex', 'race', 'age_bucket', 'priors_bucket', 'two_year_recid'
]
df = df[keep_cols].dropna()

# One-hot encode categorical features
df = pd.get_dummies(df, columns=['sex', 'race', 'c_charge_degree', 'age_bucket', 'priors_bucket'], drop_first=True)

# Define features and target
X = df.drop(columns=['two_year_recid'])
y = df['two_year_recid']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Train LightGBM with class balancing
lgbm_clf = lgb.LGBMClassifier(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.05,
    class_weight='balanced',
    random_state=42
)
lgbm_clf.fit(X_train, y_train)

# Evaluate
y_pred = lgbm_clf.predict(X_test)
y_proba = lgbm_clf.predict_proba(X_test)[:, 1]
acc = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_proba)
print(f"Accuracy: {acc:.2%}") 
print("Classification Report:")
print(classification_report(y_test, y_pred))
print(f"ROC AUC Score: {roc_auc:.2f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
joblib.dump(lgbm_clf, "models/reoffend_model.pkl")
print("✅ Model saved as models/reoffend_model.pkl")