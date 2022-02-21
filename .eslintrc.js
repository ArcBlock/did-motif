module.exports = {
  parser: 'babel-eslint',
  extends: '@arcblock/eslint-config',
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
};
