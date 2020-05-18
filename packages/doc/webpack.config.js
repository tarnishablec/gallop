const base = require('../../webpack.base.js')(__dirname)

module.exports = {
  ...base,
  externals: ['@gallop/gallop']
}
