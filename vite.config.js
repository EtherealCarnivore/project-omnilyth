import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { poeSessionPlugin, sessionCookie } from './scripts/dev/poeSession.js'

// Dev-only proxy to the official trade API. The PoE session (imported from the
// browser via /__dev/poe-session, or POESESSID / POETOKEN in .env.local) is
// attached here, on the dev server, so it never reaches the browser bundle.
// Without one the search runs anonymously.
function tradeProxy() {
  return {
    target: 'https://www.pathofexile.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/poe-trade/, '/api/trade'),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('origin')
        proxyReq.removeHeader('referer')
        proxyReq.removeHeader('cookie')
        proxyReq.setHeader('User-Agent', 'Omnilyth-Dev/1.0 (+https://github.com/EtherealCarnivore/project-omnilyth)')
        const cookie = sessionCookie()
        if (cookie) proxyReq.setHeader('Cookie', cookie)
      })
    },
  }
}

// Cookie-free proxies, shared by `vite` and `vite preview`.
const publicProxies = {
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
}

const env = loadEnv(process.env.NODE_ENV === 'production' ? 'production' : 'development', process.cwd(), '')

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss(), poeSessionPlugin(env)],
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
    proxy: { ...publicProxies, '/api/poe-trade': tradeProxy() },
  },
  // `vite preview` would otherwise reuse server.proxy, and the session guard
  // in scripts/dev/poeSession.js is a dev-server (serve) plugin only, so preview
  // gets no trade proxy.
  preview: {
    proxy: publicProxies,
  },
})
