Place your ONNX model file here (e.g., model.onnx).

Requirements for the provided LiveOnnxClassifier defaults:
- Input: NCHW float32 tensor with shape [1, 3, 224, 224]
- Pixel normalization: (x/255 - mean) / std with mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]
- Output: logits vector of length = number of labels you configure

If your model differs, adjust props on LiveOnnxClassifier and the preprocessing accordingly.

Optional labels for nicer names:
- Create `public/models/labels.json` with an array of class names in the exact output order of your model.
- The app will load it automatically for the live classifier.

TFJS COCO‑SSD (설치 없이 사용)
- 설정 파일(선택): `public/models/config.json`
  {
    "provider": "tfjs-coco"
  }
- 브라우저에서 TensorFlow.js와 COCO‑SSD 모델을 CDN으로 로드합니다. 추가 설치가 필요 없습니다.
- 결과 라벨은 COCO 클래스명입니다(bottle, cup 등). 분리수거 카테고리로 매핑하려면 `public/models/mapping.json`을 수정하세요.

매핑 파일 예시: `public/models/mapping.json`
{
  "plastic": ["bottle"],
  "paper": ["cardboard", "book"],
  "metal": ["can"],
  "glass": ["wine glass", "vase"],
  "other": ["battery"]
}
