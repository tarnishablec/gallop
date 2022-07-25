import fs from 'fs-extra'
import { REGISTRY, URL, SCOPE, AUTHOR, EMAIL } from '../../../const.js'
import path from 'path'
import {
  boot,
  resolvePackageDir,
  resolvePackageJsonPath
} from '../../../utils.js'

const cachedPkgJsonFields = [
  'devDependencies',
  'peerDependencies',
  'dependencies',
  'private',
  '_buildOptions',
  'gitHead',
  'version'
]

/**
 * @param {string} packageName
 * @param {{
 *   reset?: boolean
 *   email?: string
 *   author?: string
 *   lib?: boolean
 * }} options
 */
export const init = (
  packageName,
  { lib = true, reset = false, email = EMAIL, author = AUTHOR, ...options } = {}
) => {
  if (reset) {
    initPackageJson(packageName, {
      reset,
      email,
      author,
      lib,
      ...options
    })
    // initTest(packageName)
    !lib &&
      fs.ensureFile(
        path.resolve(resolvePackageDir(packageName), `src/index.html`)
      )
    // initIndexTs(packageName, { reset })
  }
  // boot()
}

/** @param {string} packageName */
export const initPackageJson = (
  packageName,
  /**
   * @type {{
   *   email?: string
   *   reset?: boolean
   *   author?: string
   *   lib?: boolean
   * }}
   */ { reset = false, lib = true, ...options } = {}
) => {
  const packageJsonPath = resolvePackageJsonPath(packageName)
  const packageJsonObj = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const cache = {}
  cachedPkgJsonFields
    .filter((f) => (reset ? !['version'].includes(f) : true))
    .forEach((field) =>
      Reflect.set(cache, field, Reflect.get(packageJsonObj, field))
    )
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      createPackageJsonObj({ packageName, lib, ...options }, cache),
      null,
      2
    )
  )
}

// /** @param {string} packageName */
// export const initIndexTs = (packageName, { reset = false } = {}) => {
//   const packageDir = resolvePackageDir(packageName)
//   const indexPath = path.resolve(packageDir, `src/index.ts`)
//   if (!fs.existsSync(indexPath) || reset) {
//     fs.ensureFileSync(indexPath)
//     fs.writeFileSync(indexPath, `export const hello = '${packageName}'`)
//     fs.removeSync(path.resolve(packageDir, 'lib'))
//   }
// }

/** @param {string} packageName */
export const initTest = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  const testMainPath = path.resolve(packageDir, `__tests__/index.test.ts`)
  fs.removeSync(path.resolve(packageDir, `__tests__/${packageName}.test.js`))
  if (!fs.existsSync(testMainPath)) {
    fs.ensureFileSync(testMainPath)
    fs.writeFileSync(
      testMainPath,
      `'use strict'

// import {} from '../src'

describe('test', () => {
  test('adds 1 + 2 to equal 3', () => {
    // expect(func()).toBe(res)
  })
})`
    )
  }
}

/**
 * @param {{
 *   packageName: string
 *   scope?: string
 *   author?: string
 *   email?: string
 *   url?: string
 *   registry?: string
 *   lib?: boolean
 * }} option
 * @param {object} [pkgJsonCacheObj] Default is `{}`
 * @returns {import('type-fest').PackageJson}
 */
export const createPackageJsonObj = (
  {
    packageName,
    scope = SCOPE,
    author = AUTHOR,
    email = EMAIL,
    url = URL,
    lib = true,
    registry = REGISTRY
  },
  pkgJsonCacheObj = {}
) => ({
  name: `@${scope}/${packageName}`,
  version: '0.1.0',
  type: 'module',
  private: !lib ? true : undefined,
  description: `${scope} ${packageName}`,
  main: `dist/index.umd.js`,
  module: 'dist/index.mjs',
  types: 'dist/index.d.ts',
  sideEffects: false,
  repository: {
    type: 'git',
    url
  },
  keywords: [scope, packageName, lib ? 'lib' : 'site'].filter(Boolean),
  author: {
    name: author,
    email
  },
  homepage: '',
  license: 'MIT',
  files: ['dist'],
  publishConfig: {
    access: 'public',
    registry
  },
  ...pkgJsonCacheObj
})

export default init
