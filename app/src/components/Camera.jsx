import { useRef, useState, useCallback } from 'react';

/**
 * Camera — handles both file upload and direct camera capture.
 *
 * For mobile browsers, `capture="environment"` on the file input opens
 * the rear camera directly. This is the simplest approach that works
 * across all mobile browsers without requiring WebRTC.
 *
 * For desktop, users get the standard file picker.
 *
 * When an image is selected, it is drawn onto a hidden canvas element
 * to normalize the image (handles EXIF rotation on mobile), and then
 * the canvas element is passed to the parent via onImageReady.
 *
 * @param {function} onImageReady(canvasElement, previewUrl) - called with the
 *   processed canvas and a preview URL for display.
 * @param {boolean} isProcessing - disables the UI during inference.
 * @param {string} lang - 'en' | 'hi'
 */
export default function Camera({ onImageReady, isProcessing, lang }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const text = {
    en: {
      title: 'Scan a Leaf',
      subtitle: 'Take a clear, close-up photo of a single leaf',
      uploadBtn: 'Upload Photo',
      cameraBtn: 'Take Photo',
      dragHint: 'or drag & drop an image here',
    },
    hi: {
      title: 'पत्ता स्कैन करें',
      subtitle: 'एक पत्ते की साफ़, नज़दीकी फोटो लें',
      uploadBtn: 'फोटो अपलोड करें',
      cameraBtn: 'फोटो लें',
      dragHint: 'या यहाँ फोटो खींचकर छोड़ें',
    },
  };

  const t = text[lang] ?? text.en;

  /**
   * Decode the selected file into a canvas element.
   * Using a canvas normalizes EXIF rotation (common on mobile camera photos)
   * and gives us a clean HTMLCanvasElement for tf.browser.fromPixels().
   */
  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        // Draw at original resolution (TFJS will resize to 224×224 during inference)
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Pass canvas element + preview data URL to parent
        onImageReady(canvas, canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [onImageReady]);

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  // Drag and drop support
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="text-2xl" aria-hidden="true">🌿</span>
        <div>
          <h2 className="font-bold text-gray-800" lang={lang}>{t.title}</h2>
          <p className="text-xs text-gray-500" lang={lang}>{t.subtitle}</p>
        </div>
      </div>

      <div className="card-body flex flex-col gap-4">
        {/* Drag-and-drop upload zone */}
        <div
          className={`upload-zone ${isDragging ? 'drag-over' : ''} ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={t.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <div className="upload-zone-icon">
            <span>🍃</span>
          </div>
          <p className="text-sm text-brand-700 font-medium text-center" lang={lang}>
            {t.dragHint}
          </p>
          {/* Hidden file input for gallery pick */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Camera capture (opens rear camera on mobile) */}
          <button
            className="btn-primary w-full text-base"
            disabled={isProcessing}
            onClick={() => cameraInputRef.current?.click()}
            aria-label={t.cameraBtn}
          >
            <span aria-hidden="true">📷</span>
            <span lang={lang}>{t.cameraBtn}</span>
            {/* Hidden input with capture="environment" for rear camera */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </button>

          {/* Gallery upload */}
          <button
            className="btn-secondary w-full text-base"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            aria-label={t.uploadBtn}
          >
            <span aria-hidden="true">🖼️</span>
            <span lang={lang}>{t.uploadBtn}</span>
          </button>
        </div>
      </div>

      {/* Hidden canvas used to normalize images before inference */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
