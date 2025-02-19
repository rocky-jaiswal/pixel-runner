import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'Pixel Runner',
        short_name: 'Pixel Runner',
        description: 'Pixel Runner',
        theme_color: '#162757',
        icons: [
          {
            src: 'favicon/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'favicon/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'favicon/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'favicon/maskable-favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'app_splash_1.png', // add desktop sreenshot
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Pixel Runner',
          },
          {
            src: 'app_splash_1.png', // add mobile screenshot
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Pixel Runner',
          },
        ],
      },
    }),
  ],
});
