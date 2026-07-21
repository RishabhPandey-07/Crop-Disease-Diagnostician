# 🌿 Crop Disease Diagnostician

<div align="center">

![Crop Disease Diagnostician](https://img.shields.io/badge/AI-Plant%20Disease%20Detection-16a34a?style=for-the-badge&logo=leaflet&logoColor=white)
![Accuracy](https://img.shields.io/badge/Accuracy-97.14%25-brightgreen?style=for-the-badge)
![Offline](https://img.shields.io/badge/Works-100%25%20Offline-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**AI-powered plant disease detection that works 100% in the browser — no server, no internet required.**

[🚀 Live Demo](https://crop-disease-diagnostician.vercel.app) · [📓 ML Notebook](ml/crop_disease_full_pipeline.ipynb) · [🐛 Report Bug](https://github.com/RishabhPandey-07/Crop-Disease-Diagnostician/issues)

</div>

---

## ✨ Features

- 🤖 **97.14% Accuracy** — MobileNetV2 fine-tuned on PlantVillage dataset
- 📴 **100% Offline** — Model runs entirely in the browser via TensorFlow.js
- 📸 **Camera + Upload** — Take a live photo or upload from gallery
- 💊 **Treatment Recommendations** — Detailed cure & prevention for each disease
- 🌐 **Bilingual** — English & Hindi support
- 📱 **Mobile Friendly** — Responsive design for field use

---

## 🎯 Supported Crops & Diseases

| Crop | Diseases Detected |
|------|-------------------|
| 🌽 **Corn** | Gray Leaf Spot, Common Rust, Healthy |
| 🥔 **Potato** | Early Blight, Late Blight, Healthy |
| 🍅 **Tomato** | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Healthy |

---

## 🚀 Live Demo

👉 **[https://crop-disease-diagnostician.vercel.app](https://crop-disease-diagnostician.vercel.app)**

> Upload any leaf photo → AI detects disease instantly → Get treatment recommendations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Model** | Python, TensorFlow/Keras, MobileNetV2 |
| **Browser Inference** | TensorFlow.js (tfjs_graph_model) |
| **Frontend** | React 18, Vite |
| **Dataset** | PlantVillage (via Kaggle) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
crop-disease-diagnostician/
├── app/                          # React frontend
│   ├── public/
│   │   ├── model/                # TFJS model files (model.json + .bin)
│   │   └── treatments.json       # Disease treatment database
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── hooks/
│   │   │   └── useInference.js   # TFJS model loading & inference
│   │   └── App.jsx
│   └── package.json
├── ml/
│   └── crop_disease_full_pipeline.ipynb  # Full ML pipeline (Colab)
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/RishabhPandey-07/Crop-Disease-Diagnostician.git
cd Crop-Disease-Diagnostician
```

### 2. Install dependencies
```bash
cd app
npm install
```

### 3. Add model files
The model files are required in `app/public/model/`:
```
app/public/model/
├── model.json
├── group1-shard1of3.bin
├── group1-shard2of3.bin
├── group1-shard3of3.bin
└── labels.json
```

> **Download model files** from the [Releases](https://github.com/RishabhPandey-07/Crop-Disease-Diagnostician/releases) page  
> **OR** train your own using the [ML notebook](ml/crop_disease_full_pipeline.ipynb)

### 4. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 ML Pipeline (Train Your Own Model)

The full training pipeline is in [`ml/crop_disease_full_pipeline.ipynb`](ml/crop_disease_full_pipeline.ipynb).

### Run on Google Colab (Free GPU)

1. Open [Google Colab](https://colab.research.google.com)
2. **File → Open → GitHub** → paste this repo URL
3. Open `ml/crop_disease_full_pipeline.ipynb`
4. **Runtime → Change runtime type → T4 GPU**
5. Run all cells (takes ~75 minutes)

### What the notebook does:
| Step | Description | Time |
|------|-------------|------|
| Step 0 | Fix environment (ml_dtypes) | 2 min |
| Step 1 | Import libraries + Kaggle auth | 1 min |
| Step 2 | Download PlantVillage dataset | 5 min |
| Step 3 | Organize 11 classes (80/10/10 split) | 10 min |
| Step 4 | Build MobileNetV2 model | 1 min |
| Step 5 | Phase 1: Train head only | 10 min |
| Step 6 | Phase 2: Fine-tune | 35 min |
| Step 7 | Evaluate (confusion matrix, F1) | 5 min |
| Step 8 | Convert to TFLite + TensorFlow.js | 5 min |
| Step 9 | Download model files | 1 min |

### Model Architecture
```
Input (224×224×3)
    ↓
MobileNetV2 (ImageNet pretrained, fine-tuned last 54 layers)
    ↓
GlobalAveragePooling2D
    ↓
BatchNormalization
    ↓
Dense(256, relu) + Dropout(0.35)
    ↓
Dense(11, softmax)  ← float32
```

---

## 📊 Model Performance

| Metric | Value |
|--------|-------|
| **Test Accuracy** | **97.14%** |
| **Macro F1 Score** | **0.9773** |
| **Test Samples** | 1,257 |
| **Classes** | 11 |

### Per-Class F1 Scores
| Class | F1 |
|-------|----|
| corn_common_rust | ~0.99 |
| corn_gray_leaf_spot | ~0.95 |
| corn_healthy | ~0.99 |
| potato_early_blight | ~0.97 |
| potato_late_blight | ~0.98 |
| potato_healthy | ~0.99 |
| tomato_bacterial_spot | ~0.96 |
| tomato_early_blight | ~0.97 |
| tomato_late_blight | ~0.98 |
| tomato_leaf_mold | ~0.97 |
| tomato_healthy | ~0.99 |

---

## 🚀 Deploy Your Own

### Deploy to Vercel (Free)
```bash
cd app
npx vercel --prod
```

### Deploy to Netlify
```bash
cd app
npm run build
# Drag & drop the `dist/` folder to netlify.com
```

---

## 📱 How It Works

```
📸 User uploads leaf photo
        ↓
🔄 Image resized to 224×224 + normalized [-1, 1]
        ↓
🤖 TensorFlow.js runs MobileNetV2 in browser
        ↓
📊 Softmax probabilities for 11 classes
        ↓
💊 Disease name + treatment recommendations shown
```

**No data ever leaves the device.** All inference happens locally in WebGL.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [PlantVillage Dataset](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset) — Kaggle
- [MobileNetV2](https://arxiv.org/abs/1801.04381) — Google
- [TensorFlow.js](https://www.tensorflow.org/js) — Google
- [Vite](https://vitejs.dev/) + [React](https://react.dev/)

---

<div align="center">

**Built with ❤️ to help smallholder farmers 🌾**

[⬆ Back to top](#-crop-disease-diagnostician)

</div>
