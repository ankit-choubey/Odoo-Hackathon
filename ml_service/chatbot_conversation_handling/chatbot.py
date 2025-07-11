from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_name = "microsoft/DialoGPT-medium"

print("Loading model... (this may take a minute)")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, use_safetensors=True)

print("Chatbot ready! Type 'exit' to end.\n")
chat_history_ids = None

for step in range(5):  
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Chatbot: Goodbye!")
        break

    new_input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")


    if chat_history_ids is not None:
        bot_input_ids = torch.cat([chat_history_ids[:, -100:], new_input_ids], dim=-1)  
    else:
        bot_input_ids = new_input_ids

    chat_history_ids = model.generate(bot_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)

    response = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
    print(f"Chatbot: {response}")
