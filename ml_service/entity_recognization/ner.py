import pandas as pd
import spacy

nlp = spacy.load("en_core_web_sm")

# Try reading with tab delimiter
df = pd.read_csv("data.csv", sep=",")
df.columns = df.columns.str.strip()

print("Columns:", df.columns.tolist())

# Use the correct column name
df['entities'] = df['text'].apply(lambda x: [(ent.text, ent.label_) for ent in nlp(x).ents])

df.to_csv("ner_output.csv", index=False)
print("✅ Done! Check ner_output.csv")
