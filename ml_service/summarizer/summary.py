from transformers import pipeline

def summarize_text(text):
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
    return summary[0]['summary_text']

if __name__ == "__main__":
    try:
        with open("input.txt", "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print("❌ Error: input.txt not found.")
        exit()

    if len(text.strip()) == 0:
        print("⚠️ input.txt is empty. Please add some text.")
        exit()

    print("\n📄 Your input starts with:\n", text[:100])

    summary = summarize_text(text)

    with open("summary.txt", "w", encoding="utf-8") as f:
        f.write(summary)

    print("\n✅ Summary saved to summary.txt")
