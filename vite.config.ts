import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    host: true,
    allowedHosts: [
      "rpst-n8n-test.precs.info"
    ],
    hmr: {
      clientPort: process.env.VITE_HMR_PORT ? parseInt(process.env.VITE_HMR_PORT) : 443,
      host: process.env.VITE_HMR_HOST || "rpst-n8n-test.precs.info"
    }
  }
})
