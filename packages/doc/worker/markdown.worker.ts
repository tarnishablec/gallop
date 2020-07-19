importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js'
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
