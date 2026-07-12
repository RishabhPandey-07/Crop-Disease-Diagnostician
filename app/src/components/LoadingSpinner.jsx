/**
 * LoadingSpinner — animated leaf spinner shown during model loading or inference.
 * Uses a CSS animation to give a lively, non-generic loading state.
 */
export default function LoadingSpinner({ message = 'Loading…', size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-2xl',
    md: 'w-14 h-14 text-4xl',
    lg: 'w-20 h-20 text-5xl',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Pulsing leaf icon in a spinning ring */}
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div
          className={`${sizes[size]} rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin`}
          role="progressbar"
          aria-label="Loading"
        />
        {/* Leaf emoji centered */}
        <span
          className="absolute text-2xl animate-pulse-slow"
          aria-hidden="true"
        >
          🌿
        </span>
      </div>

      {message && (
        <p className="text-sm font-medium text-brand-600 text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
