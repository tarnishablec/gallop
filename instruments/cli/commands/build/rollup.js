import chalk from 'chalk'
import {
  queryPackageExternal,
  resolvePackageDir,
  resolvePackageJsonObj,
  resolveRepoRootDir,
  resolvePackageEntry,
  resolveExportsPaths
} from '../../../utils.js'
import path from 'path'
import fs from 'fs-extra'
import { externalDependencies } from '../../../const.js'
import { rollup } from 'rollup'
import { handleCss } from './index.js'
import rollupScss from 'rollup-plugin-scss'
import rollupTs from 'rollup-plugin-ts'
import rollupJson from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

/**
 * @param {string} packageName
 * @param {Partial<{
 *   ignoreExternal: boolean
 *   _buildOptions: import('type-fest').PackageJson['_buildOptions']
 * }>} options
 */
export const rollupBundle = async (
  packageName,
  { ignoreExternal = false, _buildOptions } = {}
) => {
  console.log(chalk.cyanBright(`start bundling ${packageName}`))

  const packageDir = resolvePackageDir(packageName)
  const entry = resolvePackageEntry(packageName)
  const pkgObj = resolvePackageJsonObj(packageName)

  const exportsPaths = resolveExportsPaths(packageName)

  const entriesMap = exportsPaths.size ? exportsPaths : new Map([['.', entry]])

  fixTslib({ isDev: false })

  const external = [
    ...new Set([
      ...(ignoreExternal
        ? []
        : [...externalDependencies, ...queryPackageExternal(packageName)])
    ])
  ]

  // console.log(chalk.bgRedBright(external.join("\n")))

  for (const [key, entry] of entriesMap) {
    const bundle = await rollup({
      input: entry,
      plugins: [
        rollupJson(),
        rollupScss({
          output: path.resolve(packageDir, 'dist', key, 'index.css')
        }),
        rollupTs({
          tsconfig: path.resolve(resolveRepoRootDir(), 'tsconfig.json')
        })
      ],
      external,
      ..._buildOptions?.rollupOptions
    })

    const esmPath = path.resolve(packageDir, 'dist', key, 'index.esm.js')
    const umdPath = path.resolve(packageDir, 'dist', key, 'index.umd.js')

    try {
      await bundle.write({
        name: String(pkgObj.name),
        file: esmPath,
        format: 'esm'
      })
    } catch (error) {
      console.log(error)
      throw error
    }

    // await bundle.write({
    //   name: String(pkgObj.name),
    //   file: esmPath,
    //   format: "esm"
    // })

    console.log(chalk.greenBright(`>>>>> bundle generated : ${esmPath} >>>>>`))

    await bundle.write({
      name: String(pkgObj.name),
      file: umdPath,
      format: 'umd',
      plugins: [terser()]
    })

    console.log(chalk.greenBright(`>>>>> bundle generated : ${umdPath} >>>>>`))

    await bundle.close()

    fs.renameSync(
      path.resolve(packageDir, 'dist', key, 'index.esm.d.ts'),
      path.resolve(packageDir, 'dist', key, 'index.d.ts')
    )

    fs.removeSync(path.resolve(packageDir, 'dist', key, 'index.umd.d.ts'))

    handleCss(packageName)
  }

  fixTslib({ isDev: true })
}

/** https://github.com/microsoft/tslib/issues/81#issuecomment-570255557 */
export const fixTslib = ({ isDev = false } = {}) => {
  const tslibDir = path.resolve(resolveRepoRootDir(), 'node_modules/tslib')
  const mjsPath = path.resolve(tslibDir, 'tslib.mjs')
  const es6jsPath = path.resolve(tslibDir, 'tslib.es6.js')
  if (isDev) {
    if (fs.existsSync(es6jsPath) && !fs.existsSync(mjsPath)) return
    fs.renameSync(mjsPath, es6jsPath)
  } else {
    if (fs.existsSync(mjsPath) && !fs.existsSync(es6jsPath)) return
    fs.renameSync(es6jsPath, mjsPath)
  }

  console.log(
    chalk.blueBright(
      `tslib fixed : https://github.com/microsoft/tslib/issues/81#issuecomment-570255557`
    )
  )
}
