import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Get base URL from environment or default to '/'
    const baseUrl = env.VITE_BASE_URL || '/';

    return {
      base: baseUrl,
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: env.VITE_PROXY_TARGET || 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      plugins: [react()],
      define: {
        // Ensure env variables are exposed if needed
        'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.VITE_API_ENDPOINT': JSON.stringify(env.VITE_API_ENDPOINT),
        'process.env.VITE_LOCAL_API_ENDPOINT': JSON.stringify(env.VITE_LOCAL_API_ENDPOINT),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
