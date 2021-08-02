import minimist from 'minimist'
import path from 'path'
import fs from 'fs-extra'
import { packageBlackList } from '../const.js'
import { resolveRepoRootDir } from '../utils.js'

/** @param {string} [cmd] */
export const runCommand = async (cmd) => {
  const args = minimist(process.argv.slice(2))
  const command = cmd ?? args.command

  if (command === undefined) throw new Error(`Command not found!`)

  const targets = resolveArgTargets(args)

  /**
   * @param {(
   *   packageName?: string,
   *   options?: Record<string, unknown>
   * ) => unknown} fn
   */
  const batchRun = async (fn) => {
    if (!targets.length && args.emptyIsRoot) {
      fn(undefined, args)
    } else {
      for (const target of targets) {
        try {
          await fn(target, args)
        } catch (error) {
          console.log(error)
          return
        }
      }
    }
  }

  const mod = await import(`./commands/${command}/index.js`)
  return batchRun(mod.default ?? mod[command])
}

/** @param {Record<string, unknown>} args */
export const resolveArgTargets = ({ emptyIsRoot, ignoreBlackList } = {}) => {
  const args = minimist(process.argv.slice(2))
  // debugger
  const { _, ignore } = args
  const ignoreList = String(ignore).split(',')
  const targets = (
    _.length === 0 && !emptyIsRoot
      ? fs
          .readdirSync(path.resolve(resolveRepoRootDir(), 'packages'))
          .filter((name) =>
            ignoreBlackList ? true : ![...packageBlackList].includes(name)
          )
      : _
  ).filter((v) => !ignoreList.includes(v))
  return targets.filter(Boolean)
}

runCommand()
