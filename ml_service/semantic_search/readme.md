# Semantic Search Module

This module enables **semantic similarity search** between a user's query and a corpus of existing questions using `sentence-transformers`. It helps retrieve the most relevant previously answered question based on **meaning**, not just keywords.

## Features

- Uses pretrained sentence embeddings (e.g., `all-MiniLM-L6-v2`)
- Computes cosine similarity between queries and stored questions
- Efficient for large-scale QA search or recommendation systems
- Easily extendable to support top-k retrieval or FAISS-based indexing

```bash
pip install -r requirements.txt
