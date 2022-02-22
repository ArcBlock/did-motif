import { defineConfig } from 'vite';
import { resolve } from 'path';
import createExternal from 'vite-plugin-external';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'DIDMotif',
      fileName: format => `did-motif.${format}.js`,
    },
  },
  plugins: [
    createExternal({
      externals: {
        multibase: 'multibase',
      },
    }),
  ],
});
