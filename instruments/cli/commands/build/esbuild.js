import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { EnumMemberOrder } from '@microsoft/api-extractor-model'
import chalk from 'chalk'
import { externalDependencies } from '../../../const.js'
import { scssPlugin } from '../../../plugins/esbuild-plugin-scss/index.js'
import {
  resolvePackageDir,
  queryPackageExternal,
  resolveRepoRootDir,
  resolvePackageEntry,
  resolveEsmTargetPath
} from '../../../utils.js'
import path from 'path'
import ts from 'typescript'
import fs from 'fs-extra'
import { handleCss } from './index.js'
import esbuild from 'esbuild'

/** @param {string} packageName */
export const esbuildbundle = async (
  packageName,
  { ignoreExternal = false } = {}
) => {
  // const packageDir = resolvePackageDir(packageName)

  /**
   * @type {{
   *   format: import('esbuild').BuildOptions['format']
   *   minify?: boolean
   *   target: string
   * }[]}
   */
  const buildFormats = [
    // { format: "esm", minify: true, outfileName: "index.esm.min.js" },
    { format: 'esm', target: resolveEsmTargetPath(packageName) }
    // { format: "cjs", minify: true, outfileName: "index.cjs.js" },
    // { format: "iife", minify: true, outfileName: "index.iife.js" }
  ]

  const entry = resolvePackageEntry(packageName)

  for (const { format, minify, target } of buildFormats) {
    const outfile = target

    console.log(
      chalk.cyan(
        `===== Building ${packageName} == format: ${format} == minify: ${!!minify} =====`
      )
    )
    await esbuild.build({
      entryPoints: [resolvePackageEntry(packageName)],
      outfile,
      loader: { '.ts': 'ts', '.tsx': 'tsx' },
      format,
      target: 'esnext',
      minify,
      platform: 'browser',
      external: [
        ...new Set([
          ...(ignoreExternal
            ? []
            : [...externalDependencies, ...queryPackageExternal(packageName)])
        ])
      ],
      plugins: [scssPlugin()],
      bundle: true
    })

    console.log(
      chalk.greenBright(`===== Building finished >>>>> ${outfile} =====`)
    )
  }

  generateDts(packageName, { entry })
  handleCss(packageName)
}

/** @param {string} packageName */
export function generateDts(packageName, { entry = `src/index.ts` } = {}) {
  const packageDir = resolvePackageDir(packageName)

  console.log(
    chalk.yellow(`===== Generating ${packageName} Declaration Files =====`)
  )

  const tempDir = path.resolve(packageDir, 'dist/.temp')

  ts.createProgram({
    // still not bug free
    rootNames: [path.resolve(packageDir, entry)],
    options: {
      declaration: true,
      emitDeclarationOnly: true,
      outDir: tempDir,
      esModuleInterop: true,
      isolatedModules: false
    }
  }).emit()

  try {
    Extractor.invoke(
      ExtractorConfig.prepare({
        configObject: {
          enumMemberOrder: EnumMemberOrder.Preserve,
          mainEntryPointFilePath: path.resolve(tempDir, 'index.d.ts'),
          dtsRollup: {
            enabled: true,
            untrimmedFilePath: path.resolve(packageDir, 'dist/index.d.ts'),
            omitTrimmingComments: true
          },
          projectFolder: packageDir,
          compiler: {
            tsconfigFilePath: path.resolve(
              resolveRepoRootDir(),
              'tsconfig.json'
            )
          },
          bundledPackages: []
        },
        configObjectFullPath: path.resolve(
          resolveRepoRootDir(),
          'tsconfig.json'
        ),
        packageJsonFullPath: path.resolve(packageDir, 'package.json')
      }),
      { showVerboseMessages: true, localBuild: true }
    )
  } catch (error) {
    fs.copySync(tempDir, path.resolve(packageDir, 'dist'))
  }

  fs.removeSync(tempDir)
}
