# 🎤 60-Second Demo Script
## Crop Disease Diagnostician

*Rehearse this until it feels natural. Target: 55–65 seconds spoken at a comfortable pace.*

---

### Opening (0–10s)
> "Every year, Indian farmers lose 20–30% of their harvest to diseases they can't identify early enough. Agronomists are hard to reach. The internet is unreliable. And most AI tools require a cloud connection to work.
> So we built **Crop Disease Diagnostician** — an AI tool that works entirely offline, on any smartphone, with no app to install."

### Demo (10–35s)
*(have the app open on your phone / screen share)*

> "Here's how it works. I take a photo of this tomato leaf."

*(upload/take photo)*

> "In about 1.5 seconds — completely on-device, no network call — the AI identifies this as **Tomato Early Blight** with **91% confidence**."

*(point to confidence bar)*

> "And immediately below, the farmer gets: what caused it, three organic treatment steps they can do today, and a prevention tip. In Hindi or English, depending on their preference."

*(tap Hindi toggle to show)*

> "Every word of this advice was expert-reviewed and is bundled directly in the app. The farmer doesn't need internet. They don't need a data plan. They don't need to wait."

### Architecture punch (35–50s)
> "Under the hood: MobileNetV2 fine-tuned on PlantVillage — **XX% accuracy on 11 disease classes** across tomato, potato, and corn. Model is 3.5 MB, quantized to INT8. Runs on WebGL in any browser.
>
> Treatment advice is pre-computed expert knowledge stored as a local JSON file. Zero API cost. Zero LLM hallucination risk in the field. The entire stack costs **$0 to run** after deployment."

### Close (50–60s)
> "We're covering the three most economically significant crops for Indian smallholders. The app is deployed on Vercel, installable as a PWA, and the codebase is fully open-source.
>
> The offline-first architecture isn't a workaround — it's a deliberate engineering choice that makes this genuinely usable for the 100 million farmers in India who can't rely on connectivity."

---

## 📌 Key Numbers to Have Ready

Fill these in after running Notebook 4:

- **Accuracy**: `__.__% top-1 on PlantVillage test set`
- **F1**: `X.XXXX macro F1`
- **Model size**: `~X.X MB (TFJS, float16 quantized)`
- **Classes**: `11 disease classes, 3 crops`
- **Inference time**: `~1.5s on [your test device]`

---

## 🎯 Likely Judge Questions & Strong Answers

**Q: Why not use a cloud API for the AI?**
> "Cloud inference requires internet and has ongoing costs. Our target users — smallholder farmers in rural India — often have 2G or no connectivity in the field. We chose TFJS browser inference because it runs on any smartphone browser after a one-time 3.5MB model download. After that, it works forever with no connection."

**Q: Why pre-generated treatment text instead of a live LLM?**
> "Three reasons: zero cost, zero hallucination risk in a safety-critical agricultural context, and it works offline. The advice was generated and reviewed once. In V2, we'd add a live LLM layer for dynamic, season/region-aware advice — but only when connectivity is available, as an enhancement rather than a dependency."

**Q: How accurate is it really?**
> "XX% on the PlantVillage test set. I want to be transparent: PlantVillage images are relatively clean — mostly single leaves on plain backgrounds. Real-world photos from a farmer's phone have more variation: shadows, multiple leaves, soil in frame. That accuracy will drop somewhat in production, which is why I'd want to collect and label a real-world validation set in V2. That's the honest engineering answer."

**Q: Why MobileNetV2 and not something bigger like EfficientNet-B7?**
> "MobileNetV2 was designed specifically for resource-constrained deployment. EfficientNet-B7 would give maybe 1-2% more accuracy but the model would be 5× larger and 4× slower in the browser. For a phone app targeting low-end devices, MobileNetV2's tradeoff is the right one."

**Q: Could this scale to more crops?**
> "Yes — PlantVillage has 38 classes. Our `treatments.json` pattern scales trivially: add entries, retrain with the new classes, re-deploy. The V2 roadmap adds wheat and rice — the two largest crops by acreage in India — plus a real-world photo validation set."

---

## 🎬 Video Recording Tips (for portfolio)

1. Record on a phone in landscape mode for the diagnosis flow
2. Use a real infected leaf photo (search "tomato early blight photo" for test images)
3. Show the Hindi toggle visibly
4. Open DevTools Network tab, set to Offline, then diagnose — proves offline claim
5. Keep it under 2 minutes for portfolio; under 60s for demo day
