import { init } from '../init/index.js'
import { SCOPE } from '../../../const.js'
import { run } from '../../../utils.js'

/** @param {string} packageName */
export const create = (packageName, { site = false, ...options }) => {
  if (!packageName)
    throw new Error(`must provide a name before create package.`)
  run(`npx lerna create @${options.scope ?? SCOPE}/${packageName} --yes`, {})
  init(packageName, { reset: true, site, ...options })
}

export default create
