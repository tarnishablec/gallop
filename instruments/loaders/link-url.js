/**
 * @typedef {import('webpack').loader.LoaderContext} LoaderContext
 */

/**
 * @this {LoaderContext}
 */
function loader() {
  const a = JSON.stringify(this.data)
  console.log(a)
}

/**
 * @this {LoaderContext}
 */
function pitch() {
  const a = JSON.stringify(this.data)
  console.log(a)
}

module.exports = loader
module.exports.pitch = pitch
