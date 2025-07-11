import torch
from torchvision import models, transforms
from PIL import Image
import urllib.request

# Load pre-trained MobileNetV2 (using recommended 'weights' argument)
from torchvision.models import MobileNet_V2_Weights
weights = MobileNet_V2_Weights.DEFAULT
model = models.mobilenet_v2(weights=weights)
model.eval()

# Define preprocessing using official weights
transform = weights.transforms()

# Load and convert image to RGB
image = Image.open("your_image.jpg").convert("RGB")
input_tensor = transform(image).unsqueeze(0)  # add batch dimension

# Run prediction
with torch.no_grad():
    outputs = model(input_tensor)
    predicted = torch.argmax(outputs, 1).item()

# Get class label names
categories = weights.meta["categories"]
predicted_class = categories[predicted]
print("Predicted class:", categories[predicted])

with open("result.txt", "w") as f:
    f.write(f"Predicted class: {predicted_class}")