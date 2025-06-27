import joblib
import numpy as np
import pandas as pd

# Load the trained model
model = joblib.load('D:/mini-project-3/backend/models/reoffend_model.pkl')

# Update this list to match your training features exactly!
FEATURE_COLUMNS = [
    'age', 'juv_fel_count', 'juv_misd_count', 'juv_other_count', 'priors_count',
    # One-hot encoded columns (update as per your training data dummies)
    'sex_Male',
    'race_African-American', 'race_Asian', 'race_Caucasian', 'race_Hispanic', 'race_Other',
    'c_charge_degree_M',
    'age_bucket_25-45', 'age_bucket_>45',
    'priors_bucket_1-5', 'priors_bucket_6-10', 'priors_bucket_11+'
]

def preprocess_features(features: dict):
    f = features.copy()

    # One-hot encoding for sex
    for sex in ['Male']:
        f[f'sex_{sex}'] = 1 if f.get('sex') == sex else 0
    if 'sex' in f:
        del f['sex']

    # One-hot encoding for race
    for race in ['African-American', 'Asian', 'Caucasian', 'Hispanic', 'Other']:
        f[f'race_{race}'] = 1 if f.get('race') == race else 0
    if 'race' in f:
        del f['race']

    # One-hot encoding for c_charge_degree
    for deg in ['M']:
        f[f'c_charge_degree_{deg}'] = 1 if f.get('c_charge_degree') == deg else 0
    if 'c_charge_degree' in f:
        del f['c_charge_degree']

    # One-hot encoding for age_bucket
    for bucket in ['25-45', '>45']:
        f[f'age_bucket_{bucket}'] = 1 if f.get('age_bucket') == bucket else 0
    if 'age_bucket' in f:
        del f['age_bucket']

    # One-hot encoding for priors_bucket
    for bucket in ['1-5', '6-10', '11+']:
        f[f'priors_bucket_{bucket}'] = 1 if f.get('priors_bucket') == bucket else 0
    if 'priors_bucket' in f:
        del f['priors_bucket']

    df = pd.DataFrame([f])

    # Ensure all columns exist
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    df = df[FEATURE_COLUMNS]
    return df.values

def predict_reoffend(features: dict):
    input_vector = preprocess_features(features)
    prediction = model.predict(input_vector)[0]
    return int(prediction)