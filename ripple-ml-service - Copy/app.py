from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import cv2
import numpy as np

# Initialize the FastAPI app
app = FastAPI(title="Ripple of Change - YOLO Inference Service")

# Load the pre-trained YOLOv8 Nano model (it will download automatically the first time)
model = YOLO('yolov8n.pt') 

@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    # 1. Read the image sent by your Java Spring Boot backend
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 2. Get total image area to calculate severity coverage later
    height, width, _ = img.shape
    total_image_area = height * width
    
    # 3. Run YOLO object detection
    results = model(img)
    
    waste_classes = []
    bounding_boxes = []
    total_box_area = 0
    
    # 4. Extract data from YOLO results
    for r in results:
        for box in r.boxes:
            # Get bounding box coordinates [x1, y1, x2, y2]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            bounding_boxes.append([x1, y1, x2, y2])
            
            # Add to total area (to calculate severity)
            total_box_area += (x2 - x1) * (y2 - y1)
            
            # Get the predicted class name (e.g., 'bottle', 'cup')
            cls_id = int(box.cls[0])
            waste_classes.append(model.names[cls_id])
            
    # 5. Calculate Severity Score based on bounding-box coverage (as per your research paper)
    coverage_percent = min((total_box_area / total_image_area) * 100, 100.0)
    
    # Map percentage to a 1-10 severity scale
    severity_score = min(max(int(coverage_percent / 10) + 1, 1), 10)
    
    # 6. Return the exact JSON structure your architecture expects
    return {
        "detected_classes": list(set(waste_classes)), # Return unique items found
        "bounding_boxes": bounding_boxes,
        "severity_score": severity_score,
        "coverage_percent": round(coverage_percent, 2)
    }