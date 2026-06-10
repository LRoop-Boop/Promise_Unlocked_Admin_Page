import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'https://api-xbdqcem4zq-uc.a.run.app',
        changeOrigin: true,
      },
      '/participants': {
        target: 'https://api-xbdqcem4zq-uc.a.run.app',
        changeOrigin: true,
      },
    }
  }
});