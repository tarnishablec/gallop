import path from 'path'
import vite from 'vite'
import { resolvePackageDir } from '../../../utils.js'
import { VitePluginPreloadCss } from '../../../plugins/vite-plugin-preload/index.js'

/** @param {string} packageName */
export const viteBuild = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  vite.build({
    root: path.resolve(packageDir, `src`),
    build: {
      outDir: path.resolve(packageDir, 'dist')
    },
    base: './',
    plugins: [VitePluginPreloadCss({ mode: 'build' })].filter(Boolean)
  })
}
