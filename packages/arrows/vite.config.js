import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    solidPlugin(),
    dts({
      entryRoot: './src',
      include: ['./src/'],
      insertTypesEntry: true
    })
  ],
  server: {
    open: '/test/index.html'
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.tsx',
      name: 'AnnotoriousArrows',
      formats: ['es', 'umd'],
      fileName: (format) => 
        format === 'umd' ? `annotorious-arrows.js` : `annotorious-arrows.es.js` 
    },
    rollupOptions: {
      external: [
        '@annotorious/annotorious', 
        '@annotorious/openseadragon', 
        'openseadragon'
      ],
      output: {
        globals: {
          '@annotorious/annotorious': 'Annotorious',
          '@annotorious/openseadragon': 'AnnotoriousOSD', 
          'openseadragon': 'OpenSeadragon'
        },
        assetFileNames: 'annotorious-arrows.[ext]'
      }
    }
  }
});