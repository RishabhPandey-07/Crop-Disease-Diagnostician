import { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { CLASS_LABELS } from '../data/labels';

const MODEL_URL = '/model/model.json';
const LABELS_URL = '/model/labels.json';

/**
 * useInference — loads TFJS model and exposes a `predict` function.
 * Tries tf.loadGraphModel first (Keras 3 SavedModel export → tfjs_graph_model).
 * Falls back to tf.loadLayersModel for older layers-model format.
 */
export function useInference() {
  const [status, setStatus] = useState('idle');
  const [loadError, setLoadError] = useState(null);
  const modelRef = useRef(null);
  const isGraphRef = useRef(false);
  const labelsRef = useRef(CLASS_LABELS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      try {
        // Load labels.json
        try {
          const res = await fetch(LABELS_URL);
          if (res.ok) {
            const dyn = await res.json();
            if (Array.isArray(dyn) && dyn.length > 0) labelsRef.current = dyn;
          }
        } catch { /* use hardcoded fallback */ }

        // Try GraphModel first, then LayersModel
        let model = null;
        let isGraph = false;
        let lastErr = null;

        try {
          model = await tf.loadGraphModel(MODEL_URL);
          isGraph = true;
          console.info('✅ Loaded as GraphModel');
        } catch (e1) {
          lastErr = e1;
          console.warn('GraphModel failed, trying LayersModel...', e1.message);
          try {
            model = await tf.loadLayersModel(MODEL_URL);
            isGraph = false;
            console.info('✅ Loaded as LayersModel');
          } catch (e2) {
            throw new Error(`Both model formats failed.\nGraph: ${e1.message}\nLayers: ${e2.message}`);
          }
        }

        // Warmup pass
        const dummy = tf.zeros([1, 224, 224, 3]);
        const warmup = isGraph ? model.execute(dummy) : model.predict(dummy);
        const warmupTensor = Array.isArray(warmup) ? warmup[0]
          : (warmup && warmup.constructor === Object ? Object.values(warmup)[0] : warmup);
        await warmupTensor.data();
        dummy.dispose();
        if (Array.isArray(warmup)) warmup.forEach(t => t.dispose());
        else if (warmup && warmup.constructor === Object) Object.values(warmup).forEach(t => t.dispose());
        else warmup.dispose();

        if (!cancelled) {
          modelRef.current = model;
          isGraphRef.current = isGraph;
          setStatus('ready');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Model load failed:', err);
          setLoadError(err.message);
          setStatus('error');
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const predict = useCallback(async (imageElement) => {
    if (!modelRef.current) throw new Error('Model not loaded yet.');

    return tf.tidy(() => {
      const img = tf.browser.fromPixels(imageElement);
      const resized = tf.image.resizeBilinear(img, [224, 224]);
      const normalized = resized.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1.0));
      const batched = normalized.expandDims(0);

      // Execute model
      const raw = isGraphRef.current
        ? modelRef.current.execute(batched)
        : modelRef.current.predict(batched);

      // Unwrap output (graph models may return dict or array)
      let predTensor;
      if (Array.isArray(raw)) {
        predTensor = raw[0];
      } else if (raw && raw.constructor === Object) {
        predTensor = Object.values(raw)[0];
      } else {
        predTensor = raw;
      }

      const probs = Array.from(predTensor.dataSync());
      const maxIdx = probs.indexOf(Math.max(...probs));
      const classKey = labelsRef.current[maxIdx] ?? `unknown_${maxIdx}`;

      return {
        classKey,
        displayIndex: maxIdx,
        confidence: probs[maxIdx],
        allProbs: probs,
        labels: labelsRef.current,
      };
    });
  }, []);

  return {
    status,
    loadError,
    predict,
    isReady: status === 'ready',
    isLoading: status === 'loading',
  };
}
