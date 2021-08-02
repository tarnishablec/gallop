import { run } from '../../../utils.js'

/** @param {string} [packageName] */
export const release = async () => {
  run(`yarn run build`)
  run(`git add .`)
  try {
    run(`cz`)
  } catch (error) {
    console.log(error)
  }
  run(`lerna publish`)
  run('yarn run clean')
}

export default release
