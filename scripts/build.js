const path = require('path')
const fse = require('fs-extra')
const { targets } = require('./utils')
const execa = require('execa')

const args = require('minimist')(process.argv.slice(2))
const formats = args.formats || args.f
const devOnly = args.devOnly || args.d

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production')

  if (!formats) {
    await fse.remove(`${pkgDir}/dist`)
  }
  await execa(
    `rollup`,
    [
      '-c',
      '--environment',
      [
        `TARGET:${target}`,
        `NODE_ENV:${env}`,
        formats ? `FORMATS:${formats}` : ''
      ]
        .filter(Boolean)
        .join(`,`)
    ],
    {
      stdio: 'inherit'
    }
  )
}

async function buildAll(targets) {
  for (const target of targets) {
    await build(target)
  }
}

buildAll(targets)
