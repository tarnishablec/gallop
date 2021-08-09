import path from 'path'
import vite from 'vite'
import { resolvePackageDir } from '../../../utils.js'

/** @param {string} packageName */
export const viteBuild = (packageName, root = 'src') => {
  const packageDir = resolvePackageDir(packageName)
  vite.build({
    root: path.resolve(packageDir, root),
    build: {
      outDir: path.resolve(packageDir, 'dist'),
      rollupOptions: {
        external: []
      }
    },
    base: './',
    esbuild: {
      format: 'esm',
      treeShaking: true,
      target: 'es6'
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: [].filter(Boolean)
  })
}
