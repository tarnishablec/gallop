import { resolvePackageDir } from '../../../utils.js'
import fs from 'fs-extra'
import path from 'path'

/** @param {string} packageName */
export const clean = (packageName) => {
  fs.removeSync(path.resolve(resolvePackageDir(packageName), 'dist'))
}

export default clean
