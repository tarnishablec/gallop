import { init } from '../init/index.js'
import { SCOPE } from '../../../const.js'
import { resolvePackageDir, run } from '../../../utils.js'
import fs from 'fs-extra'
import path from 'path'

/** @param {string} packageName */
export const create = (packageName, { lib = true, ...options }) => {
  if (!packageName)
    throw new Error(`must provide a name before create package.`)
  run(`npx lerna create @${options.scope ?? SCOPE}/${packageName} --yes`, {})
  // createNpmIgnore(packageName)
  init(packageName, { reset: true, lib, ...options })
}

/** @param {string} packageName */
export const createNpmIgnore = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  fs.writeFileSync(path.resolve(packageDir, '.npmignore'), 'src')
}

export default create
