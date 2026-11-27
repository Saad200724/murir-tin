import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../build/webgl',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
  preview: {
    host: '127.0.0.1',
    port: 4174,
  },
});
