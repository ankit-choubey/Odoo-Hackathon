#!/usr/bin/env python3.10

# enhancer.py
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
import sys

# Use FLAN-T5 for better zero-shot results
model_name = "google/flan-t5-small"

tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

# Read prompt from CLI argument
if len(sys.argv) < 2:
    print("Please provide a prompt.")
    exit()

raw_prompt = sys.argv[1]

# Format for instruction tuning
input_text = f"Improve the clarity of this prompt: {raw_prompt}"

# Tokenize
inputs = tokenizer(input_text, return_tensors="pt")

# Generate response
outputs = model.generate(
    **inputs,
    max_length=64,
    num_beams=5,
    early_stopping=True
)

# Decode
enhanced_prompt = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(enhanced_prompt)
