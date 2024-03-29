import { createServer } from 'vite'
// import { startServer } from "snowpack"
import {
  removeNodeModules,
  resolvePackageDir,
  resolveRepoRootDir,
  run,
  require
} from '../../../utils.js'
import path from 'path'
import { clean } from '../clean/index.js'
import { fixTslib } from '../build/rollup.js'
import { VitePluginString } from '../../../plugins/vite-plugin-string/index.js'
import ViteTsConfigPaths from 'vite-tsconfig-paths'

const monacoEditorPlugin = require('vite-plugin-monaco-editor')

/**
 * @param {string} packageName
 * @param {{ server: 'vite' | 'snow'; removeCache: boolean }} Default Is `"vite"`
 */
export const dev = async (packageName, { removeCache = false }) => {
  // run(`yarn run clean`)
  run(`npx lerna link --force-local`)
  clean(packageName)
  fixTslib({ isDev: true })
  viteDev(packageName, { removeCache })
}

/** @param {string} packageName */
export const viteDev = (
  packageName,
  { removeCache = false, root = 'src' } = {}
) => {
  const packageDir = resolvePackageDir(packageName)
  removeCache && removeNodeModules(packageName)
  createServer({
    // logLevel: 'info',
    // clearScreen: false,
    root: path.resolve(packageDir, root),
    define: { 'process.env': {}, global: 'window' },
    server: {
      hmr: { host: '127.0.0.1', protocol: 'ws', overlay: false },
      open: false,
      port: 10089,
      host: '127.0.0.1'
    },
    esbuild: {
      format: 'esm',
      treeShaking: true,
      target: 'esnext'
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: [
      ViteTsConfigPaths({
        projects: [path.resolve(resolveRepoRootDir(), 'tsconfig.json')]
      }),
      VitePluginString({ include: ['**/*.md'] }),
      monacoEditorPlugin.default({})
    ]
  }).then(async (server) => {
    await server.listen()
    server.printUrls()
  })
}

// snowpack is currently unusable

// /** @param {string} packageName */
// export const snowDev = (packageName) => {
//   const packageDir = resolvePackageDir(packageName)
//   startServer({
//     config: {
//       root: "",
//       exclude: [],
//       mount: {},
//       alias: {},
//       plugins: [],
//       devOptions: {
//         secure: false,
//         hostname
//       },
//     },
//   })
// }

export default dev
