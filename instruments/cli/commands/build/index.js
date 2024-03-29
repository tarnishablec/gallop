import path from 'path'
import { resolvePackageDir, resolvePackageJsonObj } from '../../../utils.js'
import { clean } from '../clean/index.js'
import fs from 'fs-extra'
import { rollupBundle } from './rollup.js'
import { esbuildbundle } from './esbuild.js'
import { viteBuild } from './vite.js'

/** @typedef {import('type-fest').PackageJson['_buildOptions']} BuildOptions */

/** @param {string} packageName */
export const build = async (
  packageName,
  /**
   * @type {{
   *   ignoreExternal?: boolean
   *   [key: string]: unknown
   * } & BuildOptions}
   */ { ignoreExternal = false, bundler, ...rest } = {}
) => {
  clean(packageName)

  const _buildOptions = resolvePackageJsonObj(packageName)._buildOptions
  bundler = bundler ?? _buildOptions?.bundler ?? 'rollup'
  // const rollupOptions = buildOptions?.rollupOptions

  // rollup has a bug dealing with { input: undefined }
  if (_buildOptions?.rollupOptions) {
    'input' in _buildOptions.rollupOptions &&
      (_buildOptions.rollupOptions.input = transformRollupInputOptions(
        _buildOptions.rollupOptions.input,
        packageName
      ))
  }

  switch (bundler) {
    case 'esbuild': {
      return esbuildbundle(packageName, { ignoreExternal, ...rest })
    }
    case 'rollup': {
      return rollupBundle(packageName, {
        ignoreExternal,
        ..._buildOptions,
        ...rest
      })
    }
    case 'vite': {
      return viteBuild(packageName, { ..._buildOptions, ...rest })
    }
  }
}

/** @param {string} packageName */
export const handleCss = (
  packageName,
  {
    inject = true,
    target = path.resolve(resolvePackageDir(packageName), 'dist/index.mjs'),
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

/**
 * @param {import('rollup').RollupOptions['input']} input
 * @param {string} packageName
 * @returns {import('rollup').RollupOptions['input']}
 */
const transformRollupInputOptions = (input, packageName) => {
  if (input === undefined) return
  /** @param {string} relativePath */
  const transformPath = (relativePath) =>
    path.resolve(resolvePackageDir(packageName), relativePath)

  if (Array.isArray(input)) return input.map(transformPath)
  if (typeof input === 'string') return transformPath(input)
  if (typeof input === 'object') {
    for (const key in input) {
      Reflect.set(input, key, transformPath(input[key]))
    }
    return input
  }
  return input
}

export default build
