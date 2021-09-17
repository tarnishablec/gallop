import { run } from '../../../utils.js'
import simpleGit from 'simple-git'

export const release = async () => {
  // run(`npx jest`)
  run(`yarn run build`)

  const git = simpleGit()
  const { changed } = await git.diffSummary()

  if (changed) {
    run(`git add .`)
    try {
      run(`npx cz`)
    } catch (error) {
      console.log(error)
      return
    }
  }

  run(`npx lerna publish --no-commit-hooks`)
  run('yarn run clean')
}

export default release
