/**
 * @typedef {import('webpack').Plugin} Plugin
 * @typedef {import('webpack').Compiler} Compiler
 * @typedef {import('webpack').compilation.Compilation} Compilation
 */

// const loaderUtils = require('loader-utils')

const pluginName = 'LinkStylePlugin'

/**
 * @this {import('webpack').loader.LoaderContext}
 * @param {string} content
 */
function loader(content) {
  // const childCompiler = this._compilation.createChildCompiler(pluginName, {})
  // this.callback(content)
  // debugger
  return
}

module.exports = loader
