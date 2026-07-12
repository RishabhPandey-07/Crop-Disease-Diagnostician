# Impact & Scalability Write-Up
## Crop Disease Diagnostician

*Use these paragraphs for hackathon submission forms, resume portfolios, and LinkedIn project descriptions. Mix and match sections as needed.*

---

## For Hackathon Submission Forms

### Problem & Impact

India is home to over 100 million smallholder farmers, who together produce more than 40% of the country's food. Crop disease is one of the leading causes of agricultural loss — studies estimate 20–40% of potential yield is destroyed annually by preventable diseases. The core barrier is not the lack of effective treatments; it's the lag between when a disease appears and when a farmer identifies it and takes action. In rural India, access to agronomists is limited, and most farmers make treatment decisions based on visual inspection alone, often too late in the disease cycle to prevent major yield loss.

Crop Disease Diagnostician addresses this directly: a farmer can photograph a single leaf and receive a specific disease identification with 3 organic treatment steps and a prevention tip — in under 2 seconds, entirely without an internet connection. The app requires no subscription, no data plan after first load, and no digital literacy beyond the ability to take a photo. It is designed to be deployable through agricultural NGOs, farmer cooperative societies, and state agricultural extension programs, at zero marginal cost per farmer served.

### Technical Approach & Architecture

The system is built on two core technical choices that together enable its offline-first, zero-cost operating model. First, disease detection uses a MobileNetV2 image classifier fine-tuned on the open PlantVillage dataset, covering 11 disease classes across tomato, potato, and corn — achieving XX% top-1 accuracy on the held-out test set. The model is converted to TensorFlow.js format with float16 quantization, reducing it to ~3.5 MB, and served via a Service Worker so it is permanently cached on the user's device after a single download. Inference runs on WebGL in the browser with no server dependency. Second, treatment recommendations are pre-computed, expert-reviewed advisory content stored in a static JSON file bundled directly into the app. This eliminates all runtime API costs and any risk of a language model improvising incorrect agricultural advice in the field — a deliberate architectural decision, not a cost-cutting shortcut. The entire diagnosis-to-treatment flow executes with zero network requests, making it as resilient to connectivity loss as a printed pamphlet, while being far more interactive and personalized.

### Scalability & V2 Roadmap

The current build covers 11 classes; PlantVillage includes 38, and expanding to wheat and rice (the two largest crops by acreage in India) requires only retraining on additional classes and adding corresponding entries to `treatments.json`. The treatment database pattern is language-agnostic: adding Marathi, Telugu, or Tamil requires only adding a new language key to each treatment entry, with no code changes. For higher-accuracy, real-world deployment, the primary V2 investment is a field-collected validation dataset — PlantVillage images are captured under controlled conditions, and real-world accuracy will vary. A React Native port would replace browser TFJS with native TFLite, reducing inference time from ~1.5s to ~200ms. For farmers with connectivity, a V2 feature would offer optional live LLM-generated advice (via Claude API) that factors in their region, current season, and crop growth stage — extending the static advice with dynamic context, without removing the offline baseline.

---

## For LinkedIn / Portfolio Description (shorter)

**Crop Disease Diagnostician** is an AI-powered PWA that identifies crop diseases from leaf photos and delivers organic treatment recommendations — entirely offline, at zero operating cost.

Built for India's smallholder farmers, the app runs a fine-tuned MobileNetV2 model (XX% accuracy, 11 classes across tomato/potato/corn) directly in the browser via TensorFlow.js. Treatment advice is served from a pre-computed JSON file, making the full diagnosis-to-treatment flow work with no internet connection after a one-time 3.5 MB model download.

**Tech**: Python · TensorFlow/Keras · TFLite (INT8) · TensorFlow.js · React · Vite · Tailwind · PWA (Workbox)

**Key numbers**: XX% test accuracy · 3.5 MB model · ~1.5s inference · 11 disease classes · EN + HI

---

## For Resume Bullet Points

- Built an offline-capable, browser-based crop disease detection app using TensorFlow.js; MobileNetV2 fine-tuned on PlantVillage dataset achieves **XX% top-1 accuracy** on 11 disease classes across 3 crops
- Implemented INT8 post-training quantization (TFLite) and float16 TFJS conversion, reducing model from **~14MB → 3.5MB** with <1% accuracy loss
- Designed a static treatment recommendation architecture (pre-computed JSON, EN + HI) that enables full offline operation with **zero API cost** and eliminates LLM hallucination risk in safety-critical agricultural context
- Deployed as a Progressive Web App with Workbox Service Worker caching model files for **100% offline capability** after first load; hosted on Vercel free tier
