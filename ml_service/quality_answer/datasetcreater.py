import pandas as pd
import random

good_samples = [
    "This solution worked perfectly for me.",
    "Thanks for the detailed explanation, very helpful!",
    "You can use a loop to iterate over the array.",
    "I disagree because the code will fail on edge cases.",
    "Great explanation with examples.",
    "Try increasing the buffer size and see if it helps.",
    "The official docs provide more details about this function.",
    "Here's a working code snippet you can try.",
    "I totally agree with the above explanation.",
    "This answer solved my problem exactly.",
]

spam_samples = [
    "Buy cheap followers at spammywebsite.com!",
    "Click here for free gifts!!!",
    "Subscribe now and get free access!",
    "Visit this link for free stuff!",
    "Spam spam spam spam spam spam spam spam spam",
    "Check out my profile for more answers!",
    "Get rich quick by clicking this link!",
    "This is spam spam spam spam.",
    "Limited offer! Act now!!!",
    "Free downloads at spamlink.com!",
]

data = []

# Generate 500 good and 500 spam samples
for _ in range(500):
    data.append({"text": random.choice(good_samples), "label": 1})
for _ in range(500):
    data.append({"text": random.choice(spam_samples), "label": 0})

# Shuffle the dataset
random.shuffle(data)

# Create DataFrame and save CSV
df = pd.DataFrame(data)
df.to_csv("answer_quality_data.csv", index=False)
print("Bigger synthetic dataset created with 1000 samples.")
