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
 *   _buildOptions: import('type-fest').PackageJson['_buildOptions']
 *   [key: string]: unknown
 * }>} options
 */
export const viteBuild = (
  packageName,
  { root = 'src', _buildOptions } = {}
) => {
  const packageDir = resolvePackageDir(packageName)
  vite.build({
    root: path.resolve(packageDir, root),
    build: {
      outDir: path.resolve(packageDir, 'dist'),
      rollupOptions: { ..._buildOptions?.rollupOptions }
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
      _buildOptions?.useMonaco ? monacoEditorPlugin.default() : undefined
    ].filter(Boolean)
  })
}
