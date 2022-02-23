module.exports = {
  extends: '@arcblock/eslint-config-base',
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  rules: {
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
        },
        ignore: ['App.js'],
      },
    ],
  },
  ignorePatterns: ['dist/'],
};
