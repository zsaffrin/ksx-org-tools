import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the popup works whether the extension is loaded
  // from the repo root (popup at dist/index.html) or from dist directly
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
          // The dist copy is its own extension root, so the popup path drops the dist/ prefix
          transform: (content) => content.replace('"dist/index.html"', '"index.html"'),
        },
      ],
    }),
  ],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
  build: {
    rollupOptions: {
      external: [
        path.resolve(__dirname, './docs'),
      ]
    }
  }
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },
});
