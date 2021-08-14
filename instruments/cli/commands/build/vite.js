import path from 'path'
import vite from 'vite'
import { resolvePackageDir, resolveRepoRootDir } from '../../../utils.js'
import { VitePluginString } from '../../../plugins/vite-plugin-string/index.js'
import ViteTsConfigPaths from 'vite-tsconfig-paths'

/** @param {string} packageName */
export const viteBuild = (packageName, root = 'src') => {
  const packageDir = resolvePackageDir(packageName)
  vite.build({
    root: path.resolve(packageDir, root),
    build: {
      outDir: path.resolve(packageDir, 'dist'),
      rollupOptions: {
        // external: ['github.css', 'prism.css', 'prism.js']
      }
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
    ].filter(Boolean)
  })
}
