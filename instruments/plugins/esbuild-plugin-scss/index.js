import sass from 'sass'
import path from 'path'

/** @returns {import('esbuild').Plugin} */
export const scssPlugin = () => ({
  name: 'esbuild-plugin-scss',
  setup: (build) => {
    build.onResolve({ filter: /\.scss$/ }, (args) => {
      return {
        path: path.resolve(args.resolveDir, args.path),
        namespace: 'x-scss'
      }
    })
    build.onLoad({ filter: /\.scss$/, namespace: 'x-scss' }, (args) => {
      const compiled = sass.renderSync({ file: args.path })
      return {
        contents: compiled.css.toString(),
        loader: 'css'
      }
    })
  }
})
