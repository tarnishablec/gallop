import { execaCommandSync } from 'execa'
import path from 'path'
import fs from 'fs-extra'
import { createRequire } from 'module'

/**
 * @param {string} cmd
 * @param {import('execa').SyncOptions} [options]
 */
export const run = (cmd, options = {}) =>
  execaCommandSync(cmd, { stdio: 'inherit', ...options })

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
 * @returns {import('type-fest').PackageJson}
 */
export const resolvePackageJsonObj = (packageName) => {
  return JSON.parse(
    fs.readFileSync(resolvePackageJsonPath(packageName), 'utf-8')
  )
}

export const boot = () => run('yarn')

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
export const resolvePeerDependencies = (packageName) => {
  const peerObj = Reflect.get(
    resolvePackageJsonObj(packageName),
    'peerDependencies'
  )
  return peerObj ? Object.keys(peerObj) : []
}

export const queryAllPackages = () => {
  return execaCommandSync('npx lerna list').stdout.split('\n')
}

export const getGifInfo = () => {
  const temp = execaCommandSync('git config -l')
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
  /** @type {import('type-fest').PackageJson} */
  const pkgJson = createRequire(import.meta.url)(
    path.resolve(packageDir, 'package.json')
  )
  const deps = Object.keys(pkgJson.dependencies ?? {})
  const peerDeps = Object.keys(pkgJson.peerDependencies ?? {})
  return [...new Set([...deps, ...peerDeps])]
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

/** @param {Record<string, unknown>} target */
export const cleanObjectFields = (target) => {
  for (const key in target) {
    if (Reflect.get(target, key) === undefined) {
      delete target[key]
    }
  }
}
