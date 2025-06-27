# backend/crime_classifier.py

from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import torch
import os

# Load model & tokenizer
MODEL_PATH = "D:/mini-project-3/backend/models/bert_classifier"
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_PATH)
model.eval()

# Load label classes
with open(os.path.join(MODEL_PATH, "label_classes.txt")) as f:
    label_classes = [line.strip() for line in f.readlines()]

def predict_crime_type(description):
    inputs = tokenizer(description, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=1).item()
    return label_classes[prediction]
