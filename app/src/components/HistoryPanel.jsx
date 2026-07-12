/**
 * HistoryPanel — shows the last N scans from localStorage.
 *
 * Each entry shows:
 * - Thumbnail of the scanned leaf
 * - Disease name (localized)
 * - Timestamp (relative: "2 hours ago")
 * - Severity color indicator
 *
 * @param {Array} history - array of scan history entries from useScanHistory
 * @param {function} onSelect - called with a history entry when user taps it
 * @param {string} lang - 'en' | 'hi'
 * @param {function} onClear - clears all history
 */
export default function HistoryPanel({ history, onSelect, lang, onClear }) {
  const text = {
    en: {
      title: 'Scan History',
      empty: 'No scans yet. Take a photo to get started!',
      clearAll: 'Clear all',
      today: 'Today',
      hoursAgo: (h) => `${h}h ago`,
      minutesAgo: (m) => `${m}m ago`,
      justNow: 'Just now',
      daysAgo: (d) => `${d}d ago`,
    },
    hi: {
      title: 'स्कैन इतिहास',
      empty: 'अभी तक कोई स्कैन नहीं। शुरू करने के लिए फोटो लें!',
      clearAll: 'सब हटाएं',
      today: 'आज',
      hoursAgo: (h) => `${h} घंटे पहले`,
      minutesAgo: (m) => `${m} मिनट पहले`,
      justNow: 'अभी',
      daysAgo: (d) => `${d} दिन पहले`,
    },
  };
  const t = text[lang] ?? text.en;

  const severityDot = {
    none:   'bg-green-500',
    medium: 'bg-amber-500',
    high:   'bg-red-500',
    unknown:'bg-gray-400',
  };

  function formatTime(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (diff < 60000) return t.justNow;
    if (minutes < 60) return t.minutesAgo(minutes);
    if (hours < 24) return t.hoursAgo(hours);
    return t.daysAgo(days);
  }

  return (
    <div className="card">
      <div className="card-header justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl" aria-hidden="true">📋</span>
          <h2 className="font-bold text-gray-800" lang={lang}>{t.title}</h2>
          {history.length > 0 && (
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
              {history.length}
            </span>
          )}
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors py-1 px-2"
            aria-label={t.clearAll}
          >
            {t.clearAll}
          </button>
        )}
      </div>

      <div className="card-body p-2">
        {history.length === 0 ? (
          <div className="empty-state">
            <span className="text-4xl" aria-hidden="true">🌱</span>
            <p lang={lang}>{t.empty}</p>
          </div>
        ) : (
          <ul role="list" className="flex flex-col gap-1">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  className="history-item w-full text-left"
                  onClick={() => onSelect(entry)}
                  aria-label={`View scan: ${entry.displayName?.[lang] ?? entry.classKey}`}
                >
                  {/* Thumbnail */}
                  {entry.imageDataUrl ? (
                    <img
                      src={entry.imageDataUrl}
                      alt="Leaf thumbnail"
                      className="history-thumb"
                    />
                  ) : (
                    <div className="history-thumb bg-brand-50 flex items-center justify-center text-2xl">
                      🍃
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-gray-800 text-sm truncate"
                      lang={lang}
                    >
                      {entry.displayName?.[lang] ?? entry.classKey}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatTime(entry.timestamp)}
                    </p>
                  </div>

                  {/* Severity dot */}
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${severityDot[entry.severity] ?? severityDot.unknown}`}
                    aria-label={entry.severity}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
