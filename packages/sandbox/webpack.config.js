const base = require('../../webpack.base.js')(__dirname)

module.exports = {
  ...base,
  output: {
    ...base.output,
    libraryTarget: 'umd'
  },
  externals: ['@gallop/gallop']
}
