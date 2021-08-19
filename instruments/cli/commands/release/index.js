import { run } from '../../../utils.js'

export const release = async () => {
  run(`npx jest`)
  run(`yarn run build`)
  run(`git add .`)
  try {
    run(`cz`)
  } catch (error) {
    console.log(error)
    return
  }
  run(`npx lerna publish`)
  run('yarn run clean')
}

export default release
