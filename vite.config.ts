import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Turn off sourcemaps for smaller builds
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
  },
});
