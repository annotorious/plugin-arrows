import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['./src/'],
      entryRoot: './src'
    })
  ],
  server: {
    open: '/test/index.html'
  },
  resolve: {
    tsconfigPaths: true 
  },
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: (format) => `annotorious-arrows-react.${format}.js`
    },
    rollupOptions: {
      external: [
        '@annotorious/annotorious', 
        '@annotorious/openseadragon', 
        'openseadragon',
        '@annotorious/react',
        'openseadragon',
        'react',
        'react-dom',
        /^react\//,        // react/jsx-runtime, react/jsx-dev-runtime
        /^react-dom\//,    // react-dom/client, etc.
      ],
      output: {
        assetFileNames: 'annotorious-arrows.[ext]'
      }
    },
    sourcemap: true
  }
});