const base = require('../../webpack.base.js')(__dirname)

/**
 * @type {import('webpack').ConfigurationFactory}
 */
module.exports = (env, args) => ({
  ...base(env, args),
  externals: args.mode === 'production' ? ['@gallop/gallop'] : []
})
