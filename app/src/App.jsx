import { useState, useEffect, useCallback, useRef } from 'react';
import { useInference } from './hooks/useInference';
import { useScanHistory } from './hooks/useScanHistory';
import Camera from './components/Camera';
import ResultCard from './components/ResultCard';
import TreatmentCard from './components/TreatmentCard';
import HistoryPanel from './components/HistoryPanel';
import LanguageToggle from './components/LanguageToggle';
import LoadingSpinner from './components/LoadingSpinner';

// treatments.json lives in /public/ and is fetched once at startup.
// After the first load, the Service Worker caches it — so this fetch
// resolves instantly from cache and works fully offline.
async function loadTreatments() {
  const res = await fetch('/treatments.json');
  if (!res.ok) throw new Error('Failed to load treatment database');
  return res.json();
}

const LANG_STORAGE_KEY = 'crop_dx_lang';

export default function App() {
  // ── Language ──────────────────────────────────────────────────────────────
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved) return saved;
    // Default to system language if Hindi
    return navigator.language?.startsWith('hi') ? 'hi' : 'en';
  });

  const handleLangChange = useCallback((code) => {
    setLang(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
  }, []);

  // ── Treatment database (fetched once, cached by Service Worker) ───────────
  const [treatments, setTreatments] = useState({});
  const [treatmentsLoaded, setTreatmentsLoaded] = useState(false);

  useEffect(() => {
    loadTreatments()
      .then(data => { setTreatments(data); setTreatmentsLoaded(true); })
      .catch(err => console.error('Treatment DB load error:', err));
  }, []);

  // ── Model inference ───────────────────────────────────────────────────────
  const { status: modelStatus, loadError, predict, isReady, isLoading } = useInference();

  // ── Scan state ────────────────────────────────────────────────────────────
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageEl, setImageEl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);       // { classKey, confidence, allProbs }
  const [treatment, setTreatment] = useState(null); // entry from treatments.json
  const [inferError, setInferError] = useState(null);

  // ── History ───────────────────────────────────────────────────────────────
  const { history, addScan, clearHistory } = useScanHistory();

  // ── Offline detection ─────────────────────────────────────────────────────
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleOnline  = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── Scroll-to-result ref ─────────────────────────────────────────────────
  const resultRef = useRef(null);

  // ── Handle new image from Camera component ────────────────────────────────
  const handleImageReady = useCallback(async (canvasElement, dataUrl) => {
    setPreviewUrl(dataUrl);
    setImageEl(canvasElement);
    setResult(null);
    setTreatment(null);
    setInferError(null);

    if (!isReady) return; // model not loaded yet — user will see "Scan" button

    await runInference(canvasElement);
  }, [isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core inference flow ───────────────────────────────────────────────────
  const runInference = useCallback(async (el) => {
    const target = el ?? imageEl;
    if (!target) return;

    setIsProcessing(true);
    setInferError(null);
    setResult(null);
    setTreatment(null);

    try {
      const inferResult = await predict(target);
      const entry = treatments[inferResult.classKey];

      setResult(inferResult);
      setTreatment(entry ?? null);

      // Save to history
      if (entry) {
        const img = new Image();
        img.src = target.toDataURL ? target.toDataURL('image/jpeg', 0.85) : previewUrl;
        img.onload = () => addScan(img, inferResult, entry);
      }

      // Scroll result into view (smooth)
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      console.error('Inference error:', err);
      setInferError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [predict, imageEl, previewUrl, addScan]);

  // ── Replay a history scan ─────────────────────────────────────────────────
  const handleHistorySelect = useCallback((entry) => {
    setPreviewUrl(entry.imageDataUrl);
    setImageEl(null);
    setResult({
      classKey: entry.classKey,
      confidence: entry.confidence,
      allProbs: [],
    });
    setTreatment(treatments[entry.classKey] ?? null);
    setInferError(null);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // ── i18n text ─────────────────────────────────────────────────────────────
  const text = {
    en: {
      appName: 'Crop Diagnostician',
      tagline: 'AI-powered plant disease detection',
      modelLoading: 'Loading AI model…',
      modelError: 'Model failed to load. Place model files in /public/model/',
      scanBtn: 'Diagnose Leaf',
      scanAgain: 'Scan Another Leaf',
      processingMsg: 'Analysing leaf…',
      errorTitle: 'Detection failed',
      offlineBadge: 'Offline Mode — fully works without internet',
      howItWorks: '📸 Take a photo → 🤖 AI detects disease → 💊 Get treatment — all offline.',
    },
    hi: {
      appName: 'फसल डॉक्टर',
      tagline: 'AI से पौधे की बीमारी पहचानें',
      modelLoading: 'AI मॉडल लोड हो रहा है…',
      modelError: 'मॉडल लोड नहीं हो सका। /public/model/ में मॉडल फ़ाइलें रखें।',
      scanBtn: 'पत्ता जाँचें',
      scanAgain: 'दूसरा पत्ता स्कैन करें',
      processingMsg: 'पत्ता विश्लेषण हो रहा है…',
      errorTitle: 'पहचान विफल',
      offlineBadge: 'ऑफलाइन मोड — बिना इंटरनेट के काम करता है',
      howItWorks: '📸 फोटो लें → 🤖 AI बीमारी पहचाने → 💊 उपचार पाएं — पूरी तरह ऑफलाइन।',
    },
  };
  const t = text[lang] ?? text.en;

  return (
    <div className="app-shell" lang={lang}>

      {/* ── Offline badge ── */}
      {isOffline && (
        <div className="offline-banner" role="status" aria-live="polite">
          <div className="offline-chip">
            <span aria-hidden="true">📴</span>
            <span lang={lang}>{t.offlineBadge}</span>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <div className="app-logo-icon" aria-hidden="true">🌾</div>
            <div>
              <p className="app-logo-text text-base leading-tight" lang={lang}>
                {t.appName}
              </p>
              <p className="text-[10px] text-brand-600 font-medium" lang={lang}>
                {t.tagline}
              </p>
            </div>
          </div>
          <LanguageToggle lang={lang} onChange={handleLangChange} />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main-container" id="main-content">

        {/* ── Model status banner ── */}
        {isLoading && (
          <div className="card px-5 py-6 flex items-center gap-4 border-brand-200 bg-brand-50">
            <LoadingSpinner size="sm" />
            <div>
              <p className="font-semibold text-brand-700" lang={lang}>{t.modelLoading}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                First load only — model is cached offline after this.
              </p>
            </div>
          </div>
        )}

        {modelStatus === 'error' && (
          <div className="alert-high" role="alert">
            <p className="font-bold text-red-800">⚠️ Model Error</p>
            <p className="text-sm text-red-700 mt-1" lang={lang}>{t.modelError}</p>
            <p className="text-xs text-red-600 mt-2 font-mono">{loadError}</p>
          </div>
        )}

        {/* ── Camera / Upload section ── */}
        <section aria-label="Scan a leaf">
          <Camera
            onImageReady={handleImageReady}
            isProcessing={isProcessing}
            lang={lang}
          />
        </section>

        {/* ── Scan / Diagnose button (shown after image selected, before result) ── */}
        {previewUrl && !result && !isProcessing && isReady && (
          <button
            className="btn-primary w-full text-lg py-4 animate-fade-in"
            onClick={() => runInference()}
            id="diagnose-btn"
          >
            <span aria-hidden="true">🔬</span>
            <span lang={lang}>{t.scanBtn}</span>
          </button>
        )}

        {/* ── Processing overlay ── */}
        {isProcessing && (
          <div className="card px-5 py-10 flex flex-col items-center gap-4 animate-fade-in">
            <LoadingSpinner size="md" message={t.processingMsg} />
          </div>
        )}

        {/* ── Inference error ── */}
        {inferError && (
          <div className="alert-high animate-fade-in" role="alert">
            <p className="font-bold text-red-800">{t.errorTitle}</p>
            <p className="text-sm text-red-700 mt-1 font-mono">{inferError}</p>
          </div>
        )}

        {/* ── Results section ── */}
        {result && treatment && (
          <section ref={resultRef} aria-label="Diagnosis result" className="flex flex-col gap-4">
            <ResultCard
              result={result}
              treatment={treatment}
              previewUrl={previewUrl}
              lang={lang}
            />
            <TreatmentCard treatment={treatment} lang={lang} />

            {/* Scan again button */}
            <button
              className="btn-secondary w-full"
              onClick={() => {
                setPreviewUrl(null);
                setImageEl(null);
                setResult(null);
                setTreatment(null);
                setInferError(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span aria-hidden="true">🔄</span>
              <span lang={lang}>{t.scanAgain}</span>
            </button>
          </section>
        )}

        {/* ── How it works blurb (shown on empty state) ── */}
        {!previewUrl && !result && (
          <div className="text-center text-sm text-brand-700 bg-brand-50 rounded-2xl px-4 py-4 border border-brand-100 animate-fade-in">
            <span lang={lang}>{t.howItWorks}</span>
          </div>
        )}

        {/* ── Scan History ── */}
        <section aria-label="Scan history">
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            lang={lang}
            onClear={clearHistory}
          />
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="text-center text-xs text-gray-400 pb-6 px-4 safe-bottom">
        <p>Crop Disease Diagnostician · Runs 100% offline · PlantVillage dataset</p>
        <p className="mt-1">Built for smallholder farmers 🌾</p>
      </footer>

    </div>
  );
}
