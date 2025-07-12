import sys
import json
from transformers import T5Tokenizer, T5ForConditionalGeneration

model_name = "google/flan-t5-base"  # or "google/flan-t5-large"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

def generate_answer(question: str, max_length: int = 200) -> str:
    prompt = f"Give a detailed explanation for: {question.strip()}"
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids

    output_ids = model.generate(
        input_ids,
        max_length=max_length,
        num_beams=5,
        no_repeat_ngram_size=2,
        early_stopping=True
    )

    return tokenizer.decode(output_ids[0], skip_special_tokens=True)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        return

    data = json.loads(sys.argv[1])
    question = data.get("question", "")
    if not question:
        print(json.dumps({"error": "Question is empty"}))
        return

    answer = generate_answer(question)
    print(json.dumps({"answer": answer}))

if __name__ == "__main__":
    main()
