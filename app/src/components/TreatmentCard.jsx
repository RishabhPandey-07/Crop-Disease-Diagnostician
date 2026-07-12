import { useState } from 'react';

/**
 * TreatmentCard — displays the full treatment recommendation for a diagnosed disease.
 *
 * Design principles:
 * - One step at a time (stepped layout) to avoid overwhelming low-literacy users
 * - Icon + number for each step (dual-coding: icon conveys meaning even without reading)
 * - Cause and Prevention in visually distinct, collapsible sections
 * - High-severity diseases get a prominent red urgent banner at the top
 *
 * @param {object} treatment - full entry from treatments.json
 * @param {string} lang - 'en' | 'hi'
 */
export default function TreatmentCard({ treatment, lang }) {
  const [showPrevention, setShowPrevention] = useState(false);

  if (!treatment) return null;

  const isHighSeverity = treatment.severity === 'high';
  const isHealthy = treatment.severity === 'none';

  const text = {
    en: {
      treatmentTitle: '🌿 Treatment Steps',
      causeTitle: '🔍 What Caused This?',
      preventionTitle: '🛡️ How to Prevent',
      showPrevention: 'Show prevention tips',
      hidePrevention: 'Hide prevention tips',
      urgentBanner: '⚠️ Act now — this disease spreads fast!',
      healthyMessage: 'Keep doing what you\'re doing. Your crop looks great!',
      noTreatment: 'No treatment needed.',
      offlineBadge: '📴 No internet needed',
    },
    hi: {
      treatmentTitle: '🌿 उपचार के चरण',
      causeTitle: '🔍 यह क्यों हुआ?',
      preventionTitle: '🛡️ रोकथाम कैसे करें',
      showPrevention: 'रोकथाम के सुझाव देखें',
      hidePrevention: 'रोकथाम के सुझाव छुपाएं',
      urgentBanner: '⚠️ अभी करें — यह बीमारी तेज़ी से फैलती है!',
      healthyMessage: 'इसी तरह करते रहें। आपकी फसल बहुत अच्छी है!',
      noTreatment: 'कोई उपचार ज़रूरी नहीं।',
      offlineBadge: '📴 इंटरनेट की ज़रूरत नहीं',
    },
  };
  const t = text[lang] ?? text.en;

  return (
    <div className="card animate-slide-up" role="region" aria-label="Treatment recommendation">
      {/* Urgent banner for high-severity diseases */}
      {isHighSeverity && (
        <div className="alert-high mx-4 mt-4 text-red-800 font-semibold text-sm" lang={lang}>
          {t.urgentBanner}
        </div>
      )}

      {/* Healthy message */}
      {isHealthy && (
        <div className="alert-none mx-4 mt-4 text-green-800 font-medium text-sm" lang={lang}>
          {t.healthyMessage}
        </div>
      )}

      {/* Cause section */}
      <div className="card-body border-b border-gray-100">
        <h3 className="section-title mb-3" lang={lang}>{t.causeTitle}</h3>
        <p
          className={`text-sm text-gray-700 leading-relaxed ${lang === 'hi' ? 'font-devanagari' : ''}`}
          lang={lang}
        >
          {treatment.cause[lang]}
        </p>
      </div>

      {/* Treatment steps */}
      <div className="card-body border-b border-gray-100 flex flex-col gap-3">
        <h3 className="section-title" lang={lang}>{t.treatmentTitle}</h3>

        {treatment.treatments.length === 0 ? (
          <p className="text-sm text-gray-500" lang={lang}>{t.noTreatment}</p>
        ) : (
          treatment.treatments.map((step, idx) => (
            <div
              key={idx}
              className="treatment-step"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Step number */}
              <div className="treatment-step-number" aria-hidden="true">
                {step.step}
              </div>

              {/* Icon */}
              <div className="treatment-step-icon" aria-hidden="true">
                {step.icon}
              </div>

              {/* Step text */}
              <p
                className={`text-sm text-gray-800 leading-relaxed flex-1 ${lang === 'hi' ? 'font-devanagari' : ''}`}
                lang={lang}
              >
                {step[lang]}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Prevention — collapsible to keep UI clean */}
      <div className="card-body">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setShowPrevention(v => !v)}
          aria-expanded={showPrevention}
        >
          <h3 className="section-title" lang={lang}>{t.preventionTitle}</h3>
          <span className={`text-brand-600 transition-transform duration-200 ${showPrevention ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showPrevention && (
          <p
            className={`mt-3 text-sm text-gray-700 leading-relaxed animate-fade-in ${lang === 'hi' ? 'font-devanagari' : ''}`}
            lang={lang}
          >
            {treatment.prevention[lang]}
          </p>
        )}
      </div>

      {/* Offline badge — reassures user that this works without internet */}
      <div className="px-5 pb-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          {t.offlineBadge}
        </span>
      </div>
    </div>
  );
}
