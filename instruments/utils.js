import execa from 'execa'
import path from 'path'
import fs from 'fs-extra'
import { createRequire } from 'module'
// import chalk from "chalk"

/**
 * @param {string} cmd
 * @param {import('execa').SyncOptions} [options]
 */
export const run = (cmd, options = {}) =>
  execa.commandSync(cmd, { stdio: 'inherit', ...options })

export const resolveRepoRootDir = () => process.cwd()

/** @param {string} packageName */
export const resolvePackageDir = (packageName) => {
  return path.resolve(resolveRepoRootDir(), `./packages/${packageName}`)
}

/** @param {string} packageName */
export const resolvePackageJsonPath = (packageName) => {
  const packageJsonPath = path.resolve(
    resolvePackageDir(packageName),
    'package.json'
  )
  if (fs.existsSync(packageJsonPath)) {
    return path.resolve(resolvePackageDir(packageName), 'package.json')
  } else {
    throw new Error(`package [${packageName}] package.json does not exist`)
  }
}

/**
 * @param {string} packageName
 * @returns {import('package-json').FullVersion}
 */
export const resolvePackageJsonObj = (packageName) => {
  return JSON.parse(
    fs.readFileSync(resolvePackageJsonPath(packageName), 'utf-8')
  )
}

export const boot = () => run('lerna bootstrap')

/** @param {number} timeout */
export const sleep = async (timeout) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(void 0)
    }, timeout)
  })
}

/** @param {string} message */
export const log = (message) => {
  console.log(message)
}

export const require = createRequire(import.meta.url)

/** @param {string} packageName */
export const isTsxPackage = (packageName) => {
  const obj = resolvePackageJsonObj(packageName)
  const keywords = Reflect.get(obj, 'keywords')
  if (Array.isArray(keywords) && keywords.includes('tsx')) {
    return true
  }
  return false
}

/** @param {string} packageName */
export const resolvePeerDependencies = (packageName) => {
  const peerObj = Reflect.get(
    resolvePackageJsonObj(packageName),
    'peerDependencies'
  )
  return peerObj ? Object.keys(peerObj) : []
}

export const queryAllPackages = () => {
  return execa.commandSync('npx lerna list').stdout.split('\n')
}

export const queryAllOutPackages = ({ withScope = true } = {}) => {
  const list = queryAllPackages()
  return list
    .filter((packageName) => {
      const pkgObj = resolvePackageJsonObj(packageName.split('/').pop() ?? '')
      /** @type {string[]} */
      const keywords = Reflect.get(pkgObj, 'keywords')
      return (
        keywords.some((v) => v.startsWith('rex-')) || keywords.includes('rex')
      )
    })
    .map((v) => (withScope ? v : String(v.split('/').pop())))
}

export const getGifInfo = () => {
  const temp = execa
    .commandSync('git config -l')
    .stdout.split('\n')
    .map((v) => v.split('='))

  /** @type {Record<string, string>} */
  const result = {}
  temp.forEach(([k, v]) => {
    if (k === undefined || v === undefined) return
    Reflect.set(result, k, v)
  })
  return result
}

/**
 * @param {string} name
 * @returns {string}
 */
export function getInfoByNameFromGit(name) {
  return Reflect.get(getGifInfo(), name) ?? ''
}

/** @param {string} packageName */
export const queryPackageExternal = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  /** @type {Record<string, string>} */
  const dependencies =
    createRequire(import.meta.url)(path.resolve(packageDir, 'package.json'))
      .dependencies ?? {}
  const deps = Object.keys(dependencies)
  const outPackages = queryAllOutPackages()
  return [...new Set([...deps, ...outPackages])]
}

/** @param {string} packageName */
export const removeNodeModules = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  fs.removeSync(path.resolve(packageDir, 'node_modules'))
}

/** @param {string} packageName */
export const resolvePackageEntry = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  if (fs.existsSync(path.resolve(packageDir, 'src/index.tsx'))) {
    return path.resolve(packageDir, 'src/index.tsx')
  }
  return path.resolve(packageDir, 'src/index.ts')
}
