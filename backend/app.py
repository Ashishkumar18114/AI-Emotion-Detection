import traceback
import io
import os
import tempfile
import requests
import base64
import numpy as np
import cv2

from flask import Flask, request, jsonify
from flask_cors import CORS 
from PIL import Image
import torch
from torchvision import transforms
from facenet_pytorch import MTCNN

# —— CONFIGURATION —————————————————————————————————————————————
MODEL_PATH = os.path.join(os.path.dirname(__file__), "emotion_vit_model.pt")
EMOTIONS   = ["angry", "happy", "sad"]
IMG_SIZE   = 224
MEAN       = [0.485, 0.456, 0.406]
STD        = [0.229, 0.224, 0.225]
# ————————————————————————————————————————————————————————————————

# Device & face detector
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
mtcnn  = MTCNN(keep_all=True, device=DEVICE, thresholds=[0.5, 0.6, 0.7], min_face_size=40)

# Load model

# Download the trained model on first startup if missing.
from pathlib import Path

model_file = Path(MODEL_PATH)
model_url = "https://huggingface.co/ashishkmr1811/AI-Emotion-Detection-Model/resolve/main/emotion_vit_model.pt"

if not model_file.exists() or model_file.stat().st_size < 100_000_000:
    print("Downloading AI model from Hugging Face...", flush=True)
    temp_file = model_file.with_suffix(".download")

    try:
        with requests.get(model_url, stream=True, timeout=(20, 120)) as response:
            response.raise_for_status()
            with open(temp_file, "wb") as f:
                for chunk in response.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        f.write(chunk)

        if temp_file.stat().st_size < 100_000_000:
            raise RuntimeError("Downloaded AI model is incomplete")

        temp_file.replace(model_file)
        print("AI model downloaded successfully!", flush=True)
    finally:
        if temp_file.exists():
            temp_file.unlink()

model = torch.jit.load(MODEL_PATH, map_location=DEVICE)

model.to(DEVICE).eval()

# Preprocessing
preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])

def process_pil(img: Image.Image):
    boxes, probs = mtcnn.detect(img)
    results = []

    if boxes is None:
        return results

    for idx_face, box in enumerate(boxes):
        face = img.crop(tuple(int(v) for v in box))
        tensor = preprocess(face).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            logits = model(tensor)
            probs_emotion = torch.nn.functional.softmax(logits, dim=1)
            confidence = float(probs_emotion.max().item())
            pred_idx = torch.argmax(logits, dim=1).item()
            label = EMOTIONS[pred_idx]

        results.append({
            "box": [float(b) for b in box],
            "expression": label,
            "confidence": round(confidence, 4)
        })

    return results

def process_camera_frame(frame: np.ndarray):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb_frame)
    return process_pil(pil_img)

# ─── Flask setup ────────────────────────────────────────────────────────
app = Flask(__name__)

# Allow cross-origin requests for this public demo API.
# No cookies or credentials are used.
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/detect', methods=['POST'])
def detect_emotion():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    f = request.files['image']
    try:
        img = Image.open(f.stream).convert("RGB")
        expressions = process_pil(img)

        if expressions and len(expressions) > 0:
            result = expressions[0]
            return jsonify({
                "emotion": result["expression"],
                "confidence": result.get("confidence", 0.95)
            }), 200
        else:
            return jsonify({
                "error": "No face detected in image"
            }), 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files['file']
    try:
        img = Image.open(f.stream).convert("RGB")
        expressions = process_pil(img)
        return jsonify({"expressions": expressions}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/predict_url', methods=['POST'])
def predict_url():
    data = request.get_json(force=True)
    if not data or 'url' not in data:
        return jsonify({"error": "No URL provided"}), 400

    url = data['url']
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        img = Image.open(io.BytesIO(resp.content)).convert("RGB")
        expressions = process_pil(img)
        return jsonify({"expressions": expressions}), 200
    except Exception as e:
        return jsonify({"error": f"Could not fetch image: {e}"}), 400

@app.route('/predict_camera', methods=['POST'])
def predict_camera():
    data = request.get_json(force=True)
    if not data or 'image_base64' not in data:
        return jsonify({"error": "Missing image_base64"}), 400

    try:
        image_data = base64.b64decode(data['image_base64'])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            raise ValueError("Image decoding failed")
        expressions = process_camera_frame(frame)
        return jsonify({"expressions": expressions}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Emotion Detection API is running',
        'status': 'healthy',
        'endpoints': ['/detect', '/upload', '/predict_url', '/predict_camera']
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)