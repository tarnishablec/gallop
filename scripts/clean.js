const path = require('path')
const { resolveTargets } = require('./utils')
const fse = require('fs-extra')
const args = require('minimist')(process.argv.slice(2))

const targets = resolveTargets(args._)

cleanAll()

function clean(target) {
  const distDir = path.resolve(`packages/${target}/dist`)
  fse.remove(distDir)
}

function cleanAll() {
  targets.forEach((target) => {
    clean(target)
  })
}
