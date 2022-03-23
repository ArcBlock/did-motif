const { build } = require('vite');
const { resolve } = require('path');
const createExternal = require('vite-plugin-external');

(async () => {
  await build({
    configFile: false,
    build: {
      lib: {
        entry: resolve(__dirname, '../src/index.js'),
        name: 'DIDMotif',
        formats: ['es', 'umd'],
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

  await build({
    configFile: false,
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, '../src/node/index.js'),
        name: 'DIDMotif',
        formats: ['cjs'],
        fileName: format => `did-motif.${format}.js`,
      },
      rollupOptions: {
        external: ['multibase', '@napi-rs/canvas'],
      },
    },
  });
})();
