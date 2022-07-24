import path from 'path'
import { build } from 'vite'
import {
  resolvePackageDir,
  resolveRepoRootDir,
  resolvePackageEntry
} from '../../../utils.js'
import { VitePluginString } from '../../../plugins/vite-plugin-string/index.js'
import ViteTsConfigPaths from 'vite-tsconfig-paths'
// const monacoEditorPlugin = require('vite-plugin-monaco-editor')

/**
 * @param {string} packageName
 * @param {Partial<
 *   {
 *     root: string
 *     [key: string]: unknown
 *   } & import('type-fest').PackageJson['_buildOptions']
 * >} options
 */
export const viteBuild = (
  packageName,
  { root = 'src', ..._buildOptions } = {}
) => {
  const { mode = 'site' } = _buildOptions

  const packageDir = resolvePackageDir(packageName)
  build({
    root: path.resolve(packageDir, root),
    build: {
      outDir: path.resolve(packageDir, 'dist'),
      rollupOptions: { ..._buildOptions?.rollupOptions },
      target: 'esnext',
      ...(mode === 'lib'
        ? {
            lib: {
              entry: resolvePackageEntry(packageName),
              formats: ['es']
            }
          }
        : undefined)
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
      })
      // _buildOptions?.useMonaco ? monacoEditorPlugin.default({}) : undefined
    ].filter(Boolean)
  })
}
