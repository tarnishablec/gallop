/**
 * @param {{toString:() => string}} content
 * @this {import('webpack').loader.LoaderContext}
 */
function loader(content) {
  this.callback(null, content.toString())
  return
}

module.exports = loader
