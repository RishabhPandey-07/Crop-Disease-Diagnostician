import { SEVERITY_CONFIG, CROP_LABELS } from '../data/labels';

/**
 * ResultCard — displays the top-1 predicted disease class with confidence.
 *
 * Visual design:
 * - Color-coded by severity (green / amber / red) — universally understood
 * - Large disease name for quick comprehension
 * - Confidence bar gives a visual sense of certainty
 * - Crop icon and badge for fast scanning
 *
 * @param {object} result - { classKey, confidence, allProbs }
 * @param {object} treatment - full treatment entry from treatments.json
 * @param {string} previewUrl - base64 data URL of the scanned leaf image
 * @param {string} lang - 'en' | 'hi'
 */
export default function ResultCard({ result, treatment, previewUrl, lang }) {
  if (!result || !treatment) return null;

  const severity = treatment.severity ?? 'none';
  const sev = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.none;
  const cropLabel = CROP_LABELS[lang]?.[treatment.crop] ?? treatment.crop;

  const confidencePct = Math.round(result.confidence * 100);

  const text = {
    en: {
      detected: 'Disease Detected',
      healthy: 'Plant is Healthy!',
      confidence: 'Confidence',
      crop: 'Crop',
      severity: 'Severity',
    },
    hi: {
      detected: 'बीमारी मिली',
      healthy: 'पौधा स्वस्थ है!',
      confidence: 'विश्वसनीयता',
      crop: 'फसल',
      severity: 'गंभीरता',
    },
  };
  const t = text[lang] ?? text.en;

  const isHealthy = severity === 'none';

  return (
    <div className="result-card" role="region" aria-label="Scan result">
      <div className={`px-5 py-4 ${sev.bg} border-b ${sev.border}`}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{treatment.icon}</span>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${sev.text}`} lang={lang}>
                {isHealthy ? t.healthy : t.detected}
              </p>
              <h3
                className="text-xl font-bold text-gray-900 leading-tight mt-0.5"
                lang={lang}
              >
                {treatment.display_name[lang]}
              </h3>
            </div>
          </div>

          {/* Severity badge */}
          <span className={`severity-badge ${sev.bg} ${sev.text} ${sev.border} flex-shrink-0`}>
            {sev.label[lang]}
          </span>
        </div>

        {/* Crop tag */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium bg-white/60 ${sev.text}`}>
            🌱 {cropLabel}
          </span>
        </div>
      </div>

      {/* Confidence bar + preview */}
      <div className="card-body flex flex-col gap-4">
        {/* Scanned image thumbnail */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Scanned leaf"
            className="preview-image"
          />
        )}

        {/* Confidence meter */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide" lang={lang}>
              {t.confidence}
            </span>
            <span className={`text-lg font-bold ${sev.text}`}>
              {confidencePct}%
            </span>
          </div>
          <div className="confidence-bar">
            <div
              className={`confidence-fill ${
                severity === 'high' ? 'from-red-500 to-red-400' :
                severity === 'medium' ? 'from-amber-500 to-amber-400' :
                'from-green-500 to-green-400'
              }`}
              style={{ width: `${confidencePct}%` }}
              role="progressbar"
              aria-valuenow={confidencePct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
