importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
importScripts(
  'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/highlight.min.js'
)

self.addEventListener('message', (e) => {
  self.postMessage(
    marked(e.data, {
      gfm: true,
      highlight: (code) => hljs.highlightAuto(code).value
    })
  )
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default null as any
