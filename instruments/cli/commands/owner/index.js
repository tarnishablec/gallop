import { run } from '../../../utils.js'
import { SCOPE } from '../../../const.js'

/**
 * @param {string} packageName
 * @param {{ account: string }} options
 */
export const owner = (packageName, options) => {
  run(`tnpm owner add ${options.account} @${SCOPE}/${packageName}`)
}
