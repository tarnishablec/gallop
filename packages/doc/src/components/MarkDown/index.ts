import { component, html, raw, lazy } from '@gallop/gallop'
import MarkDownWoker from 'worker-loader!@gallop/doc/worker/markdown.worker'

component(
  'mark-down',
  ({ filename, locale = 'zh' }: { filename: string; locale?: string }) =>
    html`<div class="markdown-body">
        ${lazy(
          async () => {
            let content: string
            try {
              content = (
                await import(
                  /* webpackInclude: /\.md$/ */
                  /* webpackChunkName: "md/[request]" */
                  /* webpackMode: "lazy" */
                  `../../markdown/${locale}/${filename}`
                )
              ).default
            } catch (e) {
              content = (
                await import(
                  /* webpackInclude: /\.md$/ */
                  /* webpackChunkName: "md/[request]" */
                  /* webpackMode: "lazy" */
                  `../../markdown/zh/${filename}`
                )
              ).default
            }
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
            pending: html` <skele-ton :title="${false}"></skele-ton> `,
            delay: 0
          }
        )}
      </div>
      <style>
        @import '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/default.min.css';
        @import 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css';
        p {
          color: var(--text-color);
        }
      </style>`
)
