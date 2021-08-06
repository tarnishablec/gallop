// @ts-check

import { createServer } from 'vite'
// import { startServer } from "snowpack"
import { removeNodeModules, resolvePackageDir, run } from '../../../utils.js'
import path from 'path'
import { clean } from '../clean/index.js'
import { fixTslib } from '../build/rollup.js'
// import sass from 'sass'
// import { VitePluginResourceQuery } from '../../../plugins/vite-plugin-resource-query/index.js'
import { VitePluginPreloadCss } from '../../../plugins/vite-plugin-preload/index.js'

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
    root: path.resolve(packageDir, root),
    define: { 'process.env': {}, global: 'window' },
    server: {
      hmr: { host: '127.0.0.1', protocol: 'ws', overlay: false },
      open: false,
      port: 10086,
      host: '127.0.0.1'
    },
    esbuild: {
      format: 'esm',
      treeShaking: true,
      target: 'es6'
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: [VitePluginPreloadCss({ mode: 'serve' })]
  }).then((server) => {
    server.listen()
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
