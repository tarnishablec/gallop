import { createFilter, dataToEsm } from '@rollup/pluginutils'

/**
 * @param {{ include: string[] }} param
 * @returns {import('vite').Plugin}
 */
export const VitePluginString = ({ include }) => {
  return {
    name: '@gallop/vite-plugin-string',
    transform(code, id) {
      const filter = createFilter(include)
      if (!filter(id)) return
      return dataToEsm(code)
    }
  }
}
