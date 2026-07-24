import { useRef, useState, useCallback } from 'react';

export default function Camera({ onImageReady, isProcessing, previewUrl, lang }) {
  const fileInputRef  = useRef(null);
  const cameraInputRef = useRef(null);
  const canvasRef     = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const text = {
    en: {
      title: 'Scan a Leaf',
      subtitle: 'Take a clear, close-up photo of a single leaf',
      uploadBtn: 'Upload Photo',
      cameraBtn: 'Take Photo',
      dragHint: 'or drag & drop an image here',
      changePhoto: 'Change Photo',
    },
    hi: {
      title: 'पत्ता स्कैन करें',
      subtitle: 'एक पत्ते की साफ़, नज़दीकी फोटो लें',
      uploadBtn: 'फोटो अपलोड करें',
      cameraBtn: 'फोटो लें',
      dragHint: 'या यहाँ फोटो खींचकर छोड़ें',
      changePhoto: 'फोटो बदलें',
    },
  };

  const t = text[lang] ?? text.en;

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        onImageReady(canvas, canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [onImageReady]);

  const handleFileChange = (e) => processFile(e.target.files?.[0]);
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop      = (e) => {
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

        {/* ── Upload / Preview Zone ── */}
        {previewUrl ? (
          /* Show uploaded image preview */
          <div className="relative rounded-2xl overflow-hidden border-2 border-brand-300 bg-black"
               style={{ minHeight: '220px' }}>
            <img
              src={previewUrl}
              alt="Uploaded leaf"
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            {/* Change photo button overlay */}
            {!isProcessing && (
              <button
                className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-brand-700
                           text-xs font-semibold px-3 py-1.5 rounded-full shadow-md
                           border border-brand-200 hover:bg-brand-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                lang={lang}
              >
                🔄 {t.changePhoto}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        ) : (
          /* Show drag-drop zone when no image */
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="btn-primary w-full text-base"
            disabled={isProcessing}
            onClick={() => cameraInputRef.current?.click()}
            aria-label={t.cameraBtn}
          >
            <span aria-hidden="true">📷</span>
            <span lang={lang}>{t.cameraBtn}</span>
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

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
