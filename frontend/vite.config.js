import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
    ],
    define: {
      'process.env.REACT_APP_OPENAI_API_KEY': JSON.stringify(env.REACT_APP_OPENAI_API_KEY)
    },
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
    }
  }
})
