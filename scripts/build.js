const path = require('path')
const fse = require('fs-extra')
const execa = require('execa')
const chalk = require('chalk')

const args = require('minimist')(process.argv.slice(2))
const formats = args.formats || args.f
const devOnly = args.devOnly || args.d

const targets = require('./utils').resolveTargets(args._)

buildAll(targets)

// const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

// async function generateDts(target) {
//   const pkgDir = path.resolve(`packages/${target}`)
//   const pkg = require(`${pkgDir}/package.json`)

//   const apiExtractorJsonPath = path.join(__dirname, `../api-extractor.json`)
//   const extractorConfig = ExtractorConfig.loadFileAndPrepare(
//     apiExtractorJsonPath
//   )
//   const extractorResult = Extractor.invoke(extractorConfig, {
//     // Equivalent to the "--local" command-line parameter
//     localBuild: true,

//     // Equivalent to the "--verbose" command-line parameter
//     showVerboseMessages: true
//   })

//   if (extractorResult.succeeded) {
//     const dtsPath = path.resolve(pkgDir, pkg.types)
//     const existing = await fse.readFile(dtsPath, 'utf-8')
//     const toAdd = await Promise.all(
//       pkg.buildOptions.dts.map(file => {
//         return fse.readFile(path.resolve(pkgDir, file), 'utf-8')
//       })
//     )
//     await fse.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
//     console.error(`API Extractor completed successfully`)
//     process.exitCode = 0
//   } else {
//     console.error(
//       `API Extractor completed with ${extractorResult.errorCount} errors` +
//         ` and ${extractorResult.warningCount} warnings`
//     )
//     process.exitCode = 1
//   }
// }

async function cleanDts(target) {
  const distDir = path.resolve(`packages/${target}/dist`)
  fse.ensureDir(distDir).then(() => {
    fse.remove(`${distDir}/index.global.d.ts`)
    fse
      .rename(`${distDir}/index.esm.d.ts`, `${distDir}/index.d.ts`)
      .then(() => {
        console.log(chalk.blueBright('d.ts file generated'))
      })
  })
}

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
    await cleanDts(target)
    // await generateDts(target)
  }
}
