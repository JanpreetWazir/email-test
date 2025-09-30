import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Only include API key in development mode
    const isDevelopment = mode === 'development';
    
    return {
      base: '/email-test/', // Change to your repo name
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: isDevelopment ? {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      } : {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
