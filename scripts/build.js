const { build } = require('vite');
const { resolve } = require('path');

(async () => {
  await build({
    configFile: false,
    build: {
      lib: {
        entry: resolve(__dirname, '../src/index.js'),
        name: 'DIDMotif',
        formats: ['es', 'umd'],
        fileName: (format) => `did-motif.${format}.js`,
      },
      rollupOptions: {
        external: ['bs58'],
        output: {
          globals: {
            bs58: 'bs58',
          },
        },
      },
    },
  });

  await build({
    configFile: false,
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, '../src/node/index.js'),
        name: 'DIDMotif',
        formats: ['es', 'cjs'],
        fileName: (format) => `did-motif.node.${format}.js`,
      },
      rollupOptions: {
        external: ['bs58'],
      },
    },
  });
})();
