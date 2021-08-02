// @ts-check

import { parseUrl } from 'query-string'
import sass from 'sass'

/** @returns {import('vite').Plugin} */
export function VitePluginPreloadCss() {
  /** @type {Set<string>} */
  const collections = new Set()

  return {
    name: 'vite-plugin-preload-css',
    enforce: 'pre',
    async resolveId(id, importer) {
      const { query, url } = parseUrl(id)
      if ('preload' in query && /\.s?css$/.test(url)) {
        console.log(importer)
        console.log(id)
        const resolution = await this.resolve(url, importer, { skipSelf: true })
        const css = sass.renderSync({ file: resolution.id })
        const name = hashify(resolution.id).toString() + '.css'
        this.emitFile({
          type: 'asset',
          source: css.css,
          name
        })
        collections.add(name)
        return name
      }
      return null
    },
    transformIndexHtml(html, ctx) {
      console.log('====transformfromIndexHTML====')
      console.log(ctx)
    }
  }
}

/**
 * Https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 *
 * @param {string} str
 */
export const hashify = (str) =>
  [...str].reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
