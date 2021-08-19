import path from 'path'
import vite from 'vite'
import { resolvePackageDir, resolveRepoRootDir } from '../../../utils.js'
import { VitePluginString } from '../../../plugins/vite-plugin-string/index.js'
import ViteTsConfigPaths from 'vite-tsconfig-paths'
// import { VitePluginPreloadCss } from '../../../plugins/vite-plugin-preload-css/index.js'

/**
 * @param {string} packageName
 * @param {Partial<{
 *   root: string
 *   rollupOptions: import('vite').BuildOptions['rollupOptions']
 *   [key: string]: unknown
 * }>} options
 */
export const viteBuild = (
  packageName,
  { root = 'src', rollupOptions } = {}
) => {
  const packageDir = resolvePackageDir(packageName)
  vite.build({
    root: path.resolve(packageDir, root),
    build: {
      outDir: path.resolve(packageDir, 'dist'),
      rollupOptions: { ...rollupOptions }
    },
    esbuild: {
      target: 'es2021'
    },
    base: './',
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: [
      ViteTsConfigPaths({
        projects: [path.resolve(resolveRepoRootDir(), 'tsconfig.json')]
      }),
      VitePluginString({
        include: ['**/*.md']
      })
      // VitePluginPreloadCss()
    ].filter(Boolean)
  })
}
