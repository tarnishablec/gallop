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

const req = require.context('../markdown', true, /\.md$/, 'lazy-once')

const importMd: (
  filename: string,
  locale?: string
) => Promise<{ default: string }> = (filename, locale = 'zh') =>
  req(`./${locale}/${filename}`)

component('mark-down', function (
  this: ReactiveElement,
  { filename, locale = 'zh' }: { filename: string; locale?: string }
) {
  return html`<div>
      ${suspense(async () => {
        const content = (await importMd(filename, locale)).default
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
    </div>
    <style>
      @import '//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/default.min.css';
    </style>`
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
