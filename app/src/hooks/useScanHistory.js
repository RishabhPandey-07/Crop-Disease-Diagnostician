import { useState, useCallback } from 'react';

const STORAGE_KEY = 'crop_dx_scan_history';
const MAX_HISTORY = 20;

/**
 * useScanHistory — reads/writes scan history to localStorage.
 *
 * Each history entry:
 * {
 *   id: string (timestamp),
 *   timestamp: number (Date.now()),
 *   imageDataUrl: string (base64 thumbnail),
 *   classKey: string,
 *   confidence: number,
 *   displayName: { en, hi },
 *   severity: string,
 *   crop: string,
 * }
 *
 * Images are stored as small JPEG thumbnails (200px wide) to keep
 * localStorage usage low. localStorage has a ~5MB limit; 20 × ~15KB = ~300KB,
 * well within budget.
 */

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    // localStorage full — remove oldest entries and retry
    console.warn('localStorage quota exceeded, trimming history.');
    const trimmed = entries.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

/**
 * Shrinks an image element to a small thumbnail and returns a base64 data URL.
 * Keeps storage use low while giving enough detail for the history list.
 */
function createThumbnail(imageElement, maxWidth = 200) {
  const canvas = document.createElement('canvas');
  const scale = maxWidth / imageElement.naturalWidth;
  canvas.width = maxWidth;
  canvas.height = Math.round(imageElement.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.7);
}

export function useScanHistory() {
  const [history, setHistory] = useState(readHistory);

  const addScan = useCallback((imageElement, result, treatment) => {
    const thumbnail = createThumbnail(imageElement);

    const entry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageDataUrl: thumbnail,
      classKey: result.classKey,
      confidence: result.confidence,
      displayName: treatment?.display_name ?? { en: result.classKey, hi: result.classKey },
      severity: treatment?.severity ?? 'unknown',
      crop: treatment?.crop ?? 'unknown',
    };

    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      writeHistory(updated);
      return updated;
    });

    return entry;
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addScan, clearHistory };
}
