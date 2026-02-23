import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'item-mod-data': ['./src/data/itemMods.js', './src/data/magicItemMods.js'],
          'cluster-jewel-data': ['./src/data/clusterJewelData.json'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api/poe-ninja': {
        target: 'https://poe.ninja',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/poe-ninja/, ''),
      },
      '/api/pobbin': {
        target: 'https://pobb.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pobbin/, ''),
      },
      '/api/pastebin': {
        target: 'https://pastebin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pastebin/, ''),
      },
    },
  },
})
