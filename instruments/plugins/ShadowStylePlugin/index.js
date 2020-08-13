/**
 * @typedef {import('webpack').Compiler} Compiler
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const cheerio = require('cheerio')
const { SyncHook } = require('tapable')

class ShadowStylePlugin {
  constructor() {
    /**
     * @type {Set<string>}
     */
    this.links = new Set()
  }
  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    const pluginName = ShadowStylePlugin.name

    if (Reflect.get(compiler.hooks, 'linkShadow')) throw new Error('Hooks Existed!')

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // this.links = []
      compilation.hooks.linkShadow = new SyncHook(['url'])
      compilation.hooks.linkShadow.tap(
        pluginName,
        /**
         * @param {string} url
         */
        (url) => {
          this.links.add(url)
        }
      )

      compilation.hooks.optimizeAssets.tap(pluginName, (assets) => {
        const keys = Object.keys(assets)
        const dels = []
        this.links.forEach((link) => {
          if (!keys.includes(link)) {
            dels.push(link)
          }
        })
        dels.forEach((del) => {
          this.links.delete(del)
        })
      })

      if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
          pluginName,
          (htmlPluginData) => {
            const { html } = htmlPluginData
            const $ = cheerio.load(html, { decodeEntities: false })
            this.links.forEach((link) => {
              $('head').append(`<link rel="preload" href="${link}" as="style">`)
              $('head').append(`<link rel="stylesheet" href="${link}">`)
            })
            htmlPluginData.html = $.html()
            // debugger
          }
        )
      }
    })
  }
}

ShadowStylePlugin.loader = require.resolve('./loader.js')
module.exports = ShadowStylePlugin
