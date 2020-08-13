const base = require('../../webpack.base.js')(__dirname)
const __prod__ = process.env.NODE_ENV === 'production'

module.exports = {
  ...base,
  externals: __prod__ ? ['@gallop/gallop'] : []
}
