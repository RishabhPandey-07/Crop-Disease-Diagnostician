/**
 * LanguageToggle — EN / HI pill switcher.
 * Persists selection to localStorage so it survives page refresh.
 * Large tap targets (min 36px height) for rural usability.
 */
export default function LanguageToggle({ lang, onChange }) {
  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिं' },
  ];

  return (
    <div className="lang-toggle" role="group" aria-label="Choose language">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          aria-pressed={lang === code}
          aria-label={code === 'en' ? 'English' : 'Hindi'}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
