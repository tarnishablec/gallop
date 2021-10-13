import path from 'path'
import vite from 'vite'
import {
  resolvePackageDir,
  resolveRepoRootDir,
  require
} from '../../../utils.js'
import { VitePluginString } from '../../../plugins/vite-plugin-string/index.js'
import ViteTsConfigPaths from 'vite-tsconfig-paths'
const monacoEditorPlugin = require('vite-plugin-monaco-editor')

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
      target: 'esnext'
    },
    base: '/',
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
      }),
      monacoEditorPlugin.default()
    ].filter(Boolean)
  })
}
