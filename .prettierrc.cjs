/** @type {import('prettier').Options} */
module.exports = {
  plugins: ['./node_modules/prettier-plugin-jsdoc'],
  semi: false,
  trailingComma: 'none',
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.js',
      options: {
        endOfLine: 'lf',
        parser: 'jsdoc-parser'
      }
    }
  ]
}
