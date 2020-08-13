const args = require('minimist')(process.argv.slice(2))
const fse = require('fs-extra')
const path = require('path')
const { scope, projectName, author, gitUrl } = require('./setting')

const packagesDir = path.resolve(__dirname, '../packages')
const targets = require('./utils').resolveTargets(args._)
const execa = require('execa')

const noscope = args.noscope

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

function initPkg(filePath, longName, shortName, _args) {
  const pkgExists = fse.existsSync(filePath)

  let oldPkg = {}

  const cacheFields = [
    'devDependencies',
    'peerDependencies',
    'dependencies',
    'private',
    'buildOptions',
    'gitHead',
    'version'
  ]

  const pkgCache = {}

  if (pkgExists) {
    oldPkg = require(filePath)

    if (oldPkg.private) {
      return
    } else {
      cacheFields.forEach((field) => {
        pkgCache[field] = oldPkg[field]
      })
    }
  }

  if (_args.force || !pkgExists) {
    const pkgJson = {
      name: longName,
      description: shortName,
      main: `src/index.ts`,
      module: `dist/index.esm.js`,
      files: ['dist', 'src'],
      unpkg: `dist/index.umd.js`,
      jsdelivr: `dist/index.esm.js`,
      types: `dist/index.d.ts`,
      repository: {
        type: 'git',
        url: gitUrl
      },
      keywords: [`${projectName}`, 'webcomponents'],
      directories: {
        src: 'src',
        test: '__tests__'
      },
      sideEffects: false,
      author,
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

function main() {
  targets.forEach((shortName) => {
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

    initPkg(pkgPath, noscope ? shortName : longName, shortName, args)
  })
  execa.commandSync('lerna bootstrap', {
    stdio: 'inherit'
  })
}

main()
