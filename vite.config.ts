import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { qrcode } from 'vite-plugin-qrcode';  // Changed import syntax

export default defineConfig({
  plugins: [
    react(),
    qrcode(),  // Use the named export
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',  // Keep this line
      manifest: {
        name: 'TourWhiz',
        short_name: 'TourWhiz',
        theme_color: '#1a365d',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Add these new configuration options
      strategies: 'generateSW',
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'  // Add fallback page
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});