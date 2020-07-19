importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js')

self.addEventListener('message', (e) => {
  self.postMessage(marked(e.data))
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default null as any
