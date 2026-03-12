import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        finder: 'src/finder.css',
      },
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },
});
