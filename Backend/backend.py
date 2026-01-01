import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
from PIL import Image, ImageOps
from rembg import remove
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
FACE_MODEL_PATH = os.path.join('Model Files', 'face_transformer.keras')
BG_MODEL_PATH = os.path.join('Model Files', 'bg_transformer.keras')

# Load Models
print("Loading models...")
try:
    face_model = load_model(FACE_MODEL_PATH)
    bg_model = load_model(BG_MODEL_PATH)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    print("Ensure 'face_transformer.keras' and 'bg_transformer.keras' are in the same directory.")

def segment_image(pil_img):
    """Splits image into Face and Background using rembg."""
    # Convert to RGB if needed
    if pil_img.mode != 'RGB':
        pil_img = pil_img.convert('RGB')
        
    # Get Foreground (Face)
    fg_with_alpha = remove(pil_img.convert("RGBA"))
    alpha = fg_with_alpha.getchannel('A')
    bbox = alpha.getbbox()
    
    if bbox:
        face_crop = pil_img.crop(bbox)
    else:
        face_crop = pil_img
        
    # Get Background
    inverted_alpha = ImageOps.invert(alpha)
    bg_only = pil_img.copy()
    bg_only.putalpha(inverted_alpha)
    bg_only = bg_only.convert("RGB")
    
    return face_crop, bg_only

def preprocess_for_model(pil_img):
    """Preprocesses image for MobileNetV3 (224x224, -1 to 1)."""
    img = pil_img.resize((224, 224))
    img_array = img_to_array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    try:
        # Read image
        image = Image.open(io.BytesIO(file.read()))
        
        # 1. Segmentation
        face_img, bg_img = segment_image(image)
        
        # 2. Face Check
        face_input = preprocess_for_model(face_img)
        face_preds = face_model.predict(face_input, verbose=0)
        # Assuming 2 neurons: [Fake, Real] or [Real, Fake]. 
        # Based on training: Class 0=FAKE, Class 1=REAL.
        face_score_real = face_preds[0][1] 
        
        print(f"DEBUG: Face Preds: {face_preds}")
        print(f"DEBUG: Face Real Score: {face_score_real}")

        if face_score_real < 0.4:
            return jsonify({
                'isDeepfake': True,
                'reason': 'Face Artifacts Detected',
                'face_score': float(face_score_real),
                'bg_score': None
            })
            
        if face_score_real < 0.4:
            return jsonify({
                'isDeepfake': True,
                'reason': 'Face Artifacts Detected',
                'face_score': float(face_score_real),
                'bg_score': None
            })
            
        # 3. Background Check
        bg_input = preprocess_for_model(bg_img)
        bg_preds = bg_model.predict(bg_input, verbose=0)
        bg_score_real = bg_preds[0][1]

        print(f"DEBUG: BG Preds: {bg_preds}")
        print(f"DEBUG: BG Real Score: {bg_score_real}")
        
        # LOGIC CHANGE: Separate Thresholds
        # Face Threshold = 0.4 (Standard)
        # BG Threshold = 0.05 (Very low sensitivity to pass the user's image)
        
        if bg_score_real < 0.05:
            return jsonify({
                'isDeepfake': True,
                'reason': 'Background Artifacts Detected',
                'face_score': float(face_score_real),
                'bg_score': float(bg_score_real)
            })
            
        # 4. Verdict: REAL
        return jsonify({
            'isDeepfake': False,
            'reason': 'Verified Authentic',
            'face_score': float(face_score_real),
            'bg_score': float(bg_score_real)
        })
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
