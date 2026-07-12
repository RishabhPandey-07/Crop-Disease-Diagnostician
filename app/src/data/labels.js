/**
 * labels.js — Maps model output index (0–10) to class key in treatments.json.
 *
 * IMPORTANT: This order is set by how the Colab training notebook sorts classes
 * and is saved into model/labels.json at training time. If you retrain, always
 * re-copy labels.json from the Colab output into public/model/labels.json.
 * The app reads labels.json dynamically at startup, so this file is a fallback
 * and display-only convenience.
 *
 * The default order below assumes TFDS PlantVillage classes filtered to our 11
 * and re-indexed 0–10 in alphabetical order of the TFDS class string.
 */

export const CLASS_LABELS = [
  'corn_gray_leaf_spot',   // 0 — Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot
  'corn_common_rust',      // 1 — Corn_(maize)___Common_rust_
  'corn_healthy',          // 2 — Corn_(maize)___healthy
  'potato_early_blight',   // 3 — Potato___Early_blight
  'potato_late_blight',    // 4 — Potato___Late_blight
  'potato_healthy',        // 5 — Potato___healthy
  'tomato_bacterial_spot', // 6 — Tomato___Bacterial_spot
  'tomato_early_blight',   // 7 — Tomato___Early_blight
  'tomato_late_blight',    // 8 — Tomato___Late_blight
  'tomato_leaf_mold',      // 9 — Tomato___Leaf_Mold
  'tomato_healthy',        // 10 — Tomato___healthy
];

export const CROP_LABELS = {
  en: { corn: 'Corn', potato: 'Potato', tomato: 'Tomato' },
  hi: { corn: 'मक्का', potato: 'आलू', tomato: 'टमाटर' },
};

export const SEVERITY_CONFIG = {
  none:   { label: { en: 'Healthy',  hi: 'स्वस्थ'  }, color: 'green',  bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300' },
  medium: { label: { en: 'Moderate', hi: 'मध्यम'  }, color: 'amber',  bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300' },
  high:   { label: { en: 'Severe',   hi: 'गंभीर'  }, color: 'red',    bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300'   },
};
