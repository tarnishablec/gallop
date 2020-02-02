const args = require('minimist')(process.argv.slice(2))
const fse = require('fs-extra')
const path = require('path')
const { scope, projectName, auther, gitUrl } = require('./setting')

const baseVersion = require('../lerna.json').version
const packagesDir = path.resolve(__dirname, '../packages')
const targets = require('./utils').targets(args._)
const execa = require('execa')

main()

function main() {
  targets.forEach(shortName => {
    const packageDir = path.join(packagesDir, shortName)
    if (!fse.statSync(packageDir).isDirectory()) {
      return
    }

    if (args.init) {
      const indexTsPath = `${packageDir}/src/index.ts`
      const testPath = `${packageDir}/__tests__/${shortName}.test.ts`

      initIndexTs(indexTsPath)
      initTest(testPath, shortName)
    }

    const longName = `@${scope}/${shortName}`
    const pkgPath = path.join(packageDir, 'package.json')
    const nodeIndexPath = path.join(packageDir, 'index.js')

    initPkg(pkgPath, longName, shortName, args)
    initIndexJs(nodeIndexPath, shortName, args)
  })
  execa.commandSync('lerna bootstrap', {
    stdio: 'inherit'
  })
}

function initIndexTs(filePath) {
  const exists = fse.existsSync(filePath)

  if (!exists) {
    fse.ensureFileSync(filePath)
    fse.writeFileSync(filePath, `export const hello = 'world'`)
    fse.removeSync(path.resolve(filePath, `../../lib`))
  }
}

function initTest(filePath, name) {
  const exists = fse.existsSync(filePath)

  if (!exists) {
    fse.ensureFileSync(filePath)
    fse.writeFileSync(
      filePath,
      `'use strict'

import {} from '../src'

describe('test', () => {
  test('adds 1 + 2 to equal 3', () => {
    //   expect(func()).toBe(res)
  })
})`
    )
    fse.removeSync(path.resolve(filePath, `../${name}.test.js`))
  }
}

function initIndexJs(filePath, name, args) {
  const indexExists = fse.existsSync(filePath)

  if (args.force || !indexExists) {
    fse.writeFileSync(
      filePath,
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

function initPkg(filePath, longName, shortName, args) {
  const pkgExists = fse.existsSync(filePath)

  let oldPkg = {}

  const cacheFields = [
    'devDependencies',
    'peerDependencies',
    'dependencies',
    'private'
  ]

  let pkgCache = {}

  if (pkgExists) {
    oldPkg = require(filePath)

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
      main: 'src/index.ts',
      module: `dist/${shortName}.esm.js`,
      files: [`index.js`, 'dist'],
      types: `dist/${shortName}.d.ts`,
      repository: {
        type: 'git',
        url: gitUrl
      },
      keywords: [`${projectName}`],
      directories: {
        src: 'src',
        test: '__tests__'
      },
      sideEffects: false,
      author: auther,
      license: 'MIT',
      homepage: '',
      publishConfig: {
        access: 'public'
      }
    }

    fse.writeFileSync(
      filePath,
      JSON.stringify(Object.assign(pkgJson, pkgCache), null, 2)
    )
  }
}
