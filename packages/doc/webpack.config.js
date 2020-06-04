const base = require('../../webpack.base.js')(__dirname)
const ProdMode = process.env.NODE_ENV === 'production'

module.exports = {
  ...base,
  externals: ProdMode ? ['@gallop/gallop'] : []
}
