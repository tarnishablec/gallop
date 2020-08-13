/**
 * @typedef {import('webpack').loader.LoaderContext} LoaderContext
 * @typedef {{prefix: string}} Options
 * @typedef {import('webpack').compilation.Compilation} Compilation
 */

// const loaderUtils = require('loader-utils')
// const pluginName = require('./index').name

/**
 * @this {LoaderContext}
 * @param {string} content
 */
function loader(content) {
  /** @type {Options} */
  const url = content.match(/"(\S+.css)"/)[1]
  /**
   * @type {Compilation}
   */
  const compilation = this._compilation
  compilation.hooks.linkShadow.call(url)
  this.callback(null, content)
  return
}

module.exports = loader
