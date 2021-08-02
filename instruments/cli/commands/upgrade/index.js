import ncu from 'npm-check-updates'
import { boot, resolvePackageDir } from '../../../utils.js'
import chalk from 'chalk'
import path from 'path'
import { REGISTRY } from '../../../const.js'

/** @param {string} [packageName] */
export const upgrade = (packageName) => {
  ncu
    .run({
      packageManager: 'yarn',
      interactive: true,
      upgrade: true,
      timeout: 600000,
      // jsonAll: true,
      registry: REGISTRY,
      reject: ['husky', 'react', 'react-dom'],
      packageFile: packageName
        ? path.resolve(resolvePackageDir(packageName), 'package.json')
        : undefined
    })
    .then((res) => {
      console.log(
        `[${packageName ?? 'Root'}] upgraded dependencies:\n${chalk.cyan(
          JSON.stringify(res, null, 2)
        )}`
      )
      Object.keys(res).length && boot()
    })
}

export default upgrade
