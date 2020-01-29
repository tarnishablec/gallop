const args = require('minimist')(process.argv.slice(2))
const fse = require('fs-extra')
const path = require('path')

const baseVersion = require('../lerna.json').version
const packagesDir = path.resolve(__dirname, '../packages')
const targets = require('./utils').targets
const execa = require('execa')

main()

function main() {
  targets.forEach(shortName => {
    const packageDir = path.join(packagesDir, shortName)
    if (!fse.statSync(packageDir).isDirectory()) {
      return
    }

    if (args.init) {
      fse.access(`${packageDir}/src/index.ts`).catch(() => {
        fse.ensureFile(`${packageDir}/src/index.ts`).then(() => {
          fse.writeFile(
            `${packageDir}/src/index.ts`,
            `export const hello = 'world'`
          )
          fse.remove(`${packageDir}/lib`)
        })
      })
      fse.access(`${packageDir}/__tests__/${shortName}.test.ts`).catch(() => {
        fse.remove(`${packageDir}/__tests__/${shortName}.test.js`)
        fse.writeFile(
          `${packageDir}/__tests__/${shortName}.test.ts`,
          `'use strict'

import {} from '../src'

test('adds 1 + 2 to equal 3', () => {
//   expect(func()).toBe(res)
})`
        )
      })
    }

    const longName = `@oruo/${shortName}`
    const pkgPath = path.join(packageDir, 'package.json')
    const nodeIndexPath = path.join(packageDir, 'index.js')

    initPkg(pkgPath, longName, shortName, args)
    initNodeIndex(nodeIndexPath, shortName, args)
  })
  execa.commandSync('lerna bootstrap', {
    stdio: 'inherit'
  })
}

function initNodeIndex(path, name, args) {
  const indexExists = fse.existsSync(path)

  if (args.force || !indexExists) {
    fse.writeFileSync(
      path,
      `'use strict'

module.exports = require('./dist/${name}.cjs.js')
      `.trim() + '\n'
      //       `
      // 'use strict'

      // if (process.env.NODE_ENV === 'production') {
      //   module.exports = require('./dist/${name}.cjs.prod.js')
      // } else {
      //   module.exports = require('./dist/${name}.cjs.js')
      // }
      //       `.trim() + '\n',
    )
  }
}

function initPkg(path, longName, shortName, args) {
  const pkgExists = fse.existsSync(path)

  let oldPkg = {}

  const cacheFields = [
    'devDependencies',
    'peerDependencies',
    'dependencies',
    'private'
  ]

  let pkgCache = {}

  if (pkgExists) {
    oldPkg = require(path)

    if (oldPkg.private) {
      return
    } else {
      cacheFields.forEach(field => {
        pkgCache[field] = oldPkg[field]
      })
    }
  }

  if (args.force || !pkgExists) {
    const pkgJson = {
      name: longName,
      version: baseVersion,
      description: shortName,
      main: 'index.js',
      module: `dist/${shortName}.esm.js`,
      files: [`index.js`, 'dist'],
      types: `dist/${shortName}.d.ts`,
      repository: {
        type: 'git',
        url: 'https://github.com/tarnishablec/oruo.git'
      },
      keywords: ['oruo'],
      directories: {
        src: 'src',
        test: '__tests__'
      },
      sideEffects: false,
      author: 'tarnishablec <tarnishablec@outlook.com>',
      license: 'MIT',
      homepage: '',
      publishConfig: {
        access: 'public'
      }
    }

    fse.writeFileSync(
      path,
      JSON.stringify(Object.assign(pkgJson, pkgCache), null, 2)
    )
  }
}
