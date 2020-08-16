/** @type {import('prettier').Options} */
module.exports = {
  semi: false,
  trailingComma: 'none',
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  arrowParens: 'always',
  endOfLine: 'crlf',
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
