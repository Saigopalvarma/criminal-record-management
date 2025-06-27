from flask import Flask, request, jsonify
import joblib
from reoffend_model import preprocess_features  # Only need preprocess_features
from flask_cors import CORS
from crime_classifier import predict_crime_type
app = Flask(__name__)
CORS(app)

# Load your model once on startup
model = joblib.load('models/reoffend_model.pkl')

def predict_reoffend(features):
    input_vector = preprocess_features(features)
    prediction = model.predict(input_vector)[0]
    return int(prediction)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # expects JSON input
    if data is None:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        prediction = predict_reoffend(data)
        return jsonify({'reoffend_prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
@app.route("/predict_crime_type", methods=["POST"])
def predict_crime():
    data = request.json
    description = data.get("description")
    if not description:
        return jsonify({"error": "Missing description"}), 400
    prediction = predict_crime_type(description)
    return jsonify({"crime_type": prediction})
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == "__main__":
    app.run(debug=True)