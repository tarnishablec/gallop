import { parseUrl } from 'query-string'
import sass from 'sass'
import cheerio from 'cheerio'

/**
 * @param {{ mode: 'serve' | 'build' }} param
 * @returns {import('vite').Plugin}
 */
export function VitePluginPreloadCss({ mode }) {
  /** @type {Set<string>} */
  const fileNames = new Set()

  return {
    name: 'vite-plugin-preload-css',
    enforce: 'pre',
    async resolveId(_, id, importer) {
      const { query, url } = parseUrl(id)
      if ('preload' in query && /\.s?css$/.test(url)) {
        // console.log(id)
        // console.log(import.meta)
        if (mode === 'build') {
          const resolution = await this.resolve(url, undefined, {
            skipSelf: true
          })
          if (resolution) {
            const css = sass.renderSync({ file: resolution.id })
            const name = url.split('/').filter(Boolean).pop()?.split('.')[0]
            const hash = hashify(url).toString()
            const refId = this.emitFile({
              type: 'asset',
              fileName: 'assets/' + name + '.' + hash + '.css',
              source: css.css
            })

            const fileName = this.getFileName(refId)
            fileNames.add(fileName)
            return `export default ${JSON.stringify(fileName)};`
          }
        }
      }
      return null
    },
    transformIndexHtml(html, ctx) {
      if (mode === 'build') {
        console.log('====transformfromIndexHTML====')
        const $ = cheerio.load(html, { decodeEntities: false })
        fileNames.forEach((href) => {
          $('head').append(`<link rel="preload" href="${href}" as="style"/>`)
        })
        return $.html()
      }
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
  }, 0) >>> 0
