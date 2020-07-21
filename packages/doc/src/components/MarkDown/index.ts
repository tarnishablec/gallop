import { component, html, ReactiveElement, raw, lazy } from '@gallop/gallop'
import MarkDownWoker from 'worker-loader!@gallop/doc/worker/markdown.worker'

const req = require.context('../../markdown', true, /\.md$/, 'lazy-once')

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
      ${lazy(
        async () => {
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
        },
        {
          pending: html` <skele-ton></skele-ton> `,
          delay: 600
        }
      )}
    </div>
    <style>
      @import '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/default.min.css';
    </style>`
})
