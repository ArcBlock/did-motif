module.exports = {
  root: true,
  extends: '@arcblock/eslint-config-base',
  env: {
    browser: true,
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
