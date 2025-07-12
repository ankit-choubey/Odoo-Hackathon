# Question Answering Module

This module uses a pretrained **T5 model** to generate high-quality answers based on user-provided questions and context. It is designed to be part of a larger AI-powered Q&A system like StackIt.

## Features

- Supports abstractive QA using the Hugging Face Transformers library
- Lightweight and fast with the T5-small model (can be upgraded to T5-base or T5-large)
- Simple API interface for integration with a frontend or chatbot
- Can handle noisy or unstructured inputs with decent accuracy

```bash
pip install -r requirements.txt
