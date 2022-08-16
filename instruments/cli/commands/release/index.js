import { run, resolvePackageJsonObj } from '../../../utils.js'
import simpleGit from 'simple-git'
import { build } from '../build/index.js'

/**
 * @param {string} [packageName]
 * @param {{ version: string }} [options]
 */
export const release = async (packageName, { version = 'patch' }) => {
  if (packageName) {
    const { name } = resolvePackageJsonObj(packageName)
    await build(packageName)
    run(
      `lerna exec --scope ${name} -- npm version ${version} && npm publish ${name}`
    )
    return
  }

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
