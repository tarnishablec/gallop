import {
  component,
  html,
  suspense,
  ReactiveElement,
  directive,
  ensurePartType,
  NodePart
} from '@gallop/gallop'
import MarkDownWoker from 'worker-loader!@gallop/doc/worker/markdown.worker'

const importMd: (filename: string) => Promise<{ default: string }> = (
  path: string
) => require.context('../markdown', false, /\.md$/, 'lazy')(`./${path}`)

component('mark-down', function (
  this: ReactiveElement,
  { filename }: { filename: string }
) {
  return html`<div>
    ${suspense(async () => {
      const content = (await importMd(filename)).default
      const worker = new MarkDownWoker()
      worker.postMessage(content)
      return new Promise((resolve) => {
        const handler = (e: MessageEvent) => {
          worker.removeEventListener('message', handler)
          worker.terminate()
          resolve(raw(e.data))
        }
        worker.addEventListener('message', handler)
      })
    })}
  </div>`
})

const raw = directive((htmlStr: string) => (part) => {
  if (!ensurePartType(part, NodePart)) return
  if (htmlStr === part.value) return
  part.clear()
  const node = new Range().createContextualFragment(htmlStr)
  const { endNode } = part.location
  endNode.parentNode!.insertBefore(node, endNode)
  part.value = htmlStr
})
