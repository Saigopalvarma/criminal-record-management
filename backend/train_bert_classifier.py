import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)
from datasets import Dataset
import evaluate
import torch
import torch.nn.functional as F

# Load dataset
df = pd.read_csv("D:/mini-project-3/backend/data/bert-dataset.csv")

# Shuffle entire data and sample 10,000 rows if dataset > 10k
df = df.sample(frac=1, random_state=42).reset_index(drop=True)
df = df[['text', 'label']].dropna()

# Optional: limit dataset size to exactly 10,000 samples
df = df.sample(n=10000, random_state=42)

# Encode labels
le = LabelEncoder()
df.loc[:, 'encoded_label'] = le.fit_transform(df['label'])

# Split train/test: 8000 train, 2000 test
train_df = df.iloc[:8000].copy()
test_df = df.iloc[8000:].copy()

# Encode labels in splits (optional, already done above)
train_df.loc[:, 'encoded_label'] = le.transform(train_df['label'])
test_df.loc[:, 'encoded_label'] = le.transform(test_df['label'])

# Drop original 'label' column to avoid duplicate column issue
train_df = train_df.drop(columns=['label'])
test_df = test_df.drop(columns=['label'])

# Rename columns before creating Dataset
train_df = train_df.rename(columns={'text': 'description', 'encoded_label': 'label'})
test_df = test_df.rename(columns={'text': 'description', 'encoded_label': 'label'})

# Select only required columns
train_dataset = Dataset.from_pandas(train_df[['description', 'label']])
test_dataset = Dataset.from_pandas(test_df[['description', 'label']])

# Save label classes for decoding later
os.makedirs("models/bert_classifier", exist_ok=True)
label_path = "models/bert_classifier/label_classes.txt"
with open(label_path, "w") as f:
    for cls in le.classes_:
        f.write(f"{cls}\n")

# Load tokenizer
tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

# Tokenize function
def tokenize(batch):
    return tokenizer(batch["description"], padding="max_length", truncation=True, max_length=128)

# Map tokenization
train_dataset = train_dataset.map(tokenize, batched=True)
test_dataset = test_dataset.map(tokenize, batched=True)

# Load model
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=len(le.classes_)
)

# Load metrics
accuracy_metric = evaluate.load("accuracy")
precision_metric = evaluate.load("precision")
recall_metric = evaluate.load("recall")
f1_metric = evaluate.load("f1")

# Compute metrics function
def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)

    accuracy = accuracy_metric.compute(predictions=preds, references=labels)["accuracy"]
    precision = precision_metric.compute(predictions=preds, references=labels, average="weighted")["precision"]
    recall = recall_metric.compute(predictions=preds, references=labels, average="weighted")["recall"]
    f1 = f1_metric.compute(predictions=preds, references=labels, average="weighted")["f1"]

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1
    }

# # Training arguments
training_args = TrainingArguments(
    output_dir="models/bert_classifier",
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_dir="logs",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=1,
    logging_steps=50,
    save_total_limit=2,
)

# # Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

# ---model training ---
# trainer.train()
# trainer.save_model("models/bert_classifier")
# tokenizer.save_pretrained("models/bert_classifier")

# Load model and tokenizer from saved checkpoint
model = DistilBertForSequenceClassification.from_pretrained("models/bert_classifier")
tokenizer = DistilBertTokenizerFast.from_pretrained("models/bert_classifier")

# Load label classes
with open("models/bert_classifier/label_classes.txt") as f:
    label_classes = [line.strip() for line in f.readlines()]

# Prediction function
def predict_crime_type_with_confidence(description):
    inputs = tokenizer(description, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1)
        predicted_class = torch.argmax(probs, dim=1).item()
        confidence = probs[0, predicted_class].item()
    return label_classes[predicted_class], confidence

label, confidence = predict_crime_type_with_confidence("")    
print(f"Predicted: {label}, Confidence: {confidence:.2f}")
