import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Crop Disease Diagnostician',
        short_name: 'CropDx',
        description: 'Offline AI tool to detect crop diseases and recommend organic treatments',
        theme_color: '#16a34a',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // Cache TFJS model files (large) with CacheFirst strategy
        runtimeCaching: [
          {
            urlPattern: /\/model\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tfjs-model-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/treatments\.json/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'treatment-data-cache',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  // Increase chunk size limit for TFJS (it's legitimately large)
  build: {
    chunkSizeWarningLimit: 5000
  }
});
