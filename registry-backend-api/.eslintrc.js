/* eslint-disable no-magic-numbers */
const [OFF, WARN, ERROR] = [0, 1, 2]
module.exports = {
  plugins: ['prettier'],
  extends: [],
  parserOptions: {
    es6: true,
    ecmaVersion: 6,
    sourceType: 'module',
    requireConfigFile: false
  },
  parser: "@babel/eslint-parser",
  rules: {
    'prettier/prettier': ERROR,
    'spaced-comment': OFF,
    'no-console': WARN,
    'consistent-return': ERROR,
    'func-names': OFF,
    'object-shorthand': OFF,
    'no-process-exit': OFF,
    'no-param-reassign': OFF,
    'no-return-await': OFF,
    'no-underscore-dangle': OFF,
    'import/no-dynamic-require': OFF,
    'consistent-return': OFF,
    'prettier/prettier': ['error', { semi: false }],
    // "prefer-destructuring": ["error", { "object": true, "array": false }],
    'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val|models|Sequelize|callback|_' }],
  },
  overrides: [],
}
