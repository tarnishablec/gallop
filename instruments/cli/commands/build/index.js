import path from 'path'
import { resolvePackageDir, resolvePackageJsonObj } from '../../../utils.js'
import { clean } from '../clean/index.js'
import fs from 'fs-extra'
import { rollupBundle } from './rollup.js'
import { esbuildbundle } from './esbuild.js'
import { viteBuild } from './vite.js'

/** @typedef {import('esbuild').BuildOptions} BuildOptions */

/** @param {string} packageName */
export const build = async (
  packageName,
  /**
   * @type {{
   *   ignoreExternal?: boolean
   *   bundler?: 'rollup' | 'esbuild' | 'vite'
   *   page?: boolean
   *   [key: string]: unknown
   * }}
   */ { ignoreExternal = false, bundler = 'rollup', ...rest } = {}
) => {
  clean(packageName)

  const buildOptions = resolvePackageJsonObj(packageName).buildOptions
  bundler = buildOptions?.bundler ?? bundler
  const rollupOptions = buildOptions?.rollupOptions

  switch (bundler) {
    case 'esbuild': {
      return esbuildbundle(packageName, { ignoreExternal, ...rest })
    }
    case 'rollup': {
      return rollupBundle(packageName, {
        ignoreExternal,
        rollupOptions,
        ...rest
      })
    }
    case 'vite': {
      return viteBuild(packageName, { ...rest })
    }
  }
}

/** @param {string} packageName */
export const handleCss = (
  packageName,
  {
    inject = true,
    target = path.resolve(resolvePackageDir(packageName), 'dist/index.esm.js'),
    injectContent = `import "./index.css"`
  } = {}
) => {
  const packageDir = resolvePackageDir(packageName)
  const distDir = path.resolve(packageDir, 'dist')
  const files = fs.readdirSync(distDir).filter((v) => v.endsWith('.css'))
  files.slice(1).forEach((f) => fs.removeSync(path.resolve(distDir, f)))
  if (files && files[0]) {
    fs.renameSync(
      path.resolve(distDir, files[0]),
      path.resolve(distDir, 'index.css')
    )

    if (inject) {
      fs.appendFileSync(target, injectContent)
    }
  }
}

export default build
