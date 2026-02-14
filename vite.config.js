import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/omnilyth-core-public/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/poe-ninja': {
        target: 'https://poe.ninja',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/poe-ninja/, ''),
      },
    },
  },
})
