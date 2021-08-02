// @ts-check

import { parseUrl } from 'query-string'
// import { createFilter } from '@rollup/pluginutils'

/**
 * @param {{
 *   querys: string[]
 *   exts?: string[]
 *   transform: (
 *     this: import('rollup').TransformPluginContext,
 *     url: string,
 *     query: string,
 *     ext: string
 *   ) => string | null | Promise<string>
 * }[]} options
 * @returns {import('vite').Plugin}
 */
export const VitePluginResourceQuery = (options) => {
  return {
    enforce: 'pre',
    name: 'vite-plugin-resource-query',
    resolveId(id) {
      const { query, url } = parseUrl(id)
      const ext = url.trim().split('.').pop()
      for (const option of options) {
        if (
          option.querys.some((q) => q in query) &&
          (option.exts === undefined || option.exts.some((e) => e === ext))
        ) {
          return option.transform.call(this, url, query, ext)
        }
      }
      return null
    },
    transform() {
      return null
    },
    transformIndexHtml(html) {
      console.log('====transform html====')
      return html
    }
  }
}
