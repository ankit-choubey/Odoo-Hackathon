# Answer Quality Scoring Module

This module is designed to predict the **quality of answers** in a Q&A platform. It classifies whether an answer is **useful**, **low-quality**, or **potentially spammy**, using NLP and machine learning techniques.

## Features

- Preprocesses text using `nltk` (stopwords removal, tokenization)
- Converts text to TF-IDF or embeddings
- Trains a classical ML model (e.g., Logistic Regression or Random Forest)
- Predicts the quality label for new answers
- Can be used as an auto-moderation filter

```bash
pip install -r requirements.txt
