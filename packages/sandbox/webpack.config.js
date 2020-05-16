const base = require('../../webpack.base.js')(__dirname)
const ProdMode = process.env.NODE_ENV === 'production'

console.log(ProdMode)
module.exports = {
  ...base
}
