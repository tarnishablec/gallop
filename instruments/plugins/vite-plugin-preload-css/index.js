import { parseUrl } from 'query-string'
import sass from 'sass'
import cheerio from 'cheerio'
import { dataToEsm } from '@rollup/pluginutils'

/** @returns {import('vite').Plugin} */
export const VitePluginPreloadCss = () => {
  /** @type {import('vite').ConfigEnv['command']} */
  let command
  /** @type {string[]} */
  const injectPool = []
  return {
    name: '@gallop/vite-plugin-preload-css',
    enforce: 'pre',
    config(_, env) {
      command = env.command
    },
    transform(_, id) {
      const { query, url } = parseUrl(id)
      if ('preload' in query && /\.s?css$/.test(url)) {
        if (command === 'serve') {
          return url
        }
        const { css } = sass.renderSync({ file: url })
        // console.log(css.toString())
        const source = css.toString()
        const refId = this.emitFile({
          source: css,
          fileName: `injects/inject.${hashify(source)}.css`,
          type: 'asset'
        })

        const name = this.getFileName(refId)
        injectPool.push(name)
        return {
          code: dataToEsm(name),
          moduleSideEffects: false
        }
      }
      // return dataToEsm(code)
      return null
    },
    transformIndexHtml(html) {
      const $ = cheerio.load(html)
      injectPool.forEach((href) => {
        $('head').append(`<link rel="preload" href="${href}" as="style">`)
      })
      return $.html()
    }
  }
}

/** @param {string} str */
export const hashify = (str) =>
  [...str].reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0) >>> 0
