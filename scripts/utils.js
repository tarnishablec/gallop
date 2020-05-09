const fs = require('fs')
const execa = require('execa')

const excludes = ['sandbox']

const resolveTargets = (argsTargets) =>
  (argsTargets.length === 0 ? fs.readdirSync('packages') : argsTargets).filter(
    (f) => {
      if (excludes.includes(f)) {
        return false
      }
      if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false
      }
      const pkg = require(`../packages/${f}/package.json`)
      if (pkg.private) {
        return false
      }
      return true
    }
  )

const run = (command, ...opts) =>
  execa.command(command, { stdio: 'inherit', ...opts })

module.exports = { excludes, resolveTargets, run }
