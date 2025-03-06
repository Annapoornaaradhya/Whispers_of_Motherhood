from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import pickle
import numpy as np
from flask_cors import CORS


# Initialize Flask app
app = Flask(__name__)
CORS(app)
# Load BERT Sentiment Model
bert_model_path = "bert_sentiment_model.pth"
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=3)
bert_model.load_state_dict(torch.load(bert_model_path, map_location=torch.device('cpu')))
bert_model.eval()

# Load Postpartum Health Model
with open("postpartum_health_model.pkl", "rb") as f:
    health_model = pickle.load(f)
print(f"Loaded Model Type: {type(health_model)}")  # Debugging Line

@app.route("/routes")
def list_routes():
    return jsonify([str(rule) for rule in app.url_map.iter_rules()])

# Sentiment Analysis API
@app.route("/predict_sentiment", methods=["POST"])
def predict_sentiment():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = bert_model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=1).item()

    sentiment_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
    return jsonify({"sentiment": sentiment_map[prediction]})

# Postpartum Health Risk API
@app.route("/predict_health", methods=["POST"])
def predict_health():
    data = request.json

    # Ensure the required features are present
    if "features" not in data or len(data["features"]) != 3:
        return jsonify({"error": "Invalid input data"}), 400

    # Convert to numpy array and reshape for model prediction
    features = np.array(data["features"]).reshape(1, -1)
    prediction = health_model.predict(features)[0]

    # Mapping prediction to risk level
    risk_map = {0: "Low", 1: "Moderate", 2: "High"}
    return jsonify({"risk_level": risk_map[prediction]})

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
