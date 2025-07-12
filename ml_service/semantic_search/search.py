from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Step 1: Sample list of past questions
past_questions = [
    "How do I fine-tune BERT?",
    "What is the best way to learn machine learning?",
    "How to use Hugging Face Transformers?",
    "What is gradient descent?",
    "How to train a custom transformer model?",
]

# Step 2: Load the model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Step 3: Encode past questions
past_embeddings = model.encode(past_questions, normalize_embeddings=True)

# Step 4: Similarity search function
def get_similar_questions(query, past_questions, past_embeddings, top_k=3):
    query_embedding = model.encode([query], normalize_embeddings=True)
    similarities = cosine_similarity(query_embedding, past_embeddings)[0]
    top_indices = similarities.argsort()[-top_k:][::-1]
    return [(past_questions[i], round(similarities[i], 3)) for i in top_indices]

# Step 5: Test the function
query = "How can I train a BERT model?"
results = get_similar_questions(query, past_questions, past_embeddings)

# Step 6: Print results
print("\nSimilar Questions:")
for q, score in results:
    print(f"- {q} (score: {score})")
