import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      "url": "./src/.junk/builtins_placeholder.jsx",
      "path": "./src/.junk/builtins_placeholder.jsx",
      "source-map-js": "./src/.junk/builtins_placeholder.jsx",
      "fs": "./src/.junk/builtins_placeholder.jsx",
    },
  },
})
