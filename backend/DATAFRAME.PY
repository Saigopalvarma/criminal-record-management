import pandas as pd
import random

# Load your original dataset
df = pd.read_csv("data/bert-dataset.csv")

# Define example normal (non-criminal) texts
normal_texts = [
    "The resident requested additional street lighting near the park.",
    "A stray dog was found near the main road and taken to the shelter.",
    "Noise complaint due to loud music during a wedding celebration.",
    "Citizen reported poor road conditions causing inconvenience.",
    "Lost mobile phone was returned by a passerby at the station.",
    "A car was parked in a no-parking zone but moved upon request.",
    "Fire alarm triggered accidentally during school drill.",
    "Request for more frequent garbage collection in the neighborhood.",
    "Water supply was irregular for three consecutive days.",
    "Pet dog escaped backyard, found safe later by owner."
]

# Generate 1,000 random normal entries
generated_normals = [{
    "text": random.choice(normal_texts),
    "label": "Normal"
} for _ in range(1000)]

# Create DataFrame and append
df_normals = pd.DataFrame(generated_normals)
df_augmented = pd.concat([df, df_normals], ignore_index=True)

# Save to CSV
df_augmented.to_csv("bert-dataset-augmented.csv", index=False)
print("✅ Saved as 'bert-dataset-augmented.csv'")
