/**
 *
 * @typedef {import('webpack').Compiler} Compiler
 * @typedef {import('webpack').loader.LoaderContext} LoaderContext
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')
// const cheerio = require('cheerio')

class LinkStylePlugin {
  constructor() {}

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap('LinkStylePlugin', (compilation) => {
      if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
        const hooks = HtmlWebpackPlugin.getHooks(compilation)
        hooks.beforeAssetTagGeneration.tapAsync('LinkStylePlugin', () => {})
        hooks.beforeEmit.tapAsync('LinkStylePlugin', () => {})
      }
    })
  }

  /**
   * @param {string} html
   */
  // processLink(html) {
  //   const $ = cheerio.load(html, { decodeEntities: false })
  // }
}

LinkStylePlugin.loader = require.resolve('./loader.js')
module.exports = LinkStylePlugin
