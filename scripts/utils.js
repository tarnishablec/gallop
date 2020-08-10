const fs = require('fs')
const execa = require('execa')

const excludes = ['sandbox', 'doc']

const resolveTargets = (argsTargets, all = false) =>
  (argsTargets.length === 0 ? fs.readdirSync('packages') : argsTargets).filter(
    (f) => {
      if (excludes.includes(f) && !all) {
        return false
      }
      if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false
      }
      const pkg = require(`../packages/${f}/package.json`)
      return !pkg.private
    }
  )

const run = (command, ...opts) =>
  execa.command(command, { stdio: 'inherit', ...opts })

module.exports = { excludes, resolveTargets, run }
