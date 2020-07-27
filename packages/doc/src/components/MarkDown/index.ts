import {
  component,
  html,
  raw,
  lazy,
  ReactiveElement,
  useStyle,
  css
} from '@gallop/gallop'
import MarkDownWoker from 'worker-loader!@gallop/doc/worker/markdown.worker'
import url from './github.css?url'

component('mark-down', function (
  this: ReactiveElement,
  { filename, locale = 'zh' }: { filename: string; locale?: string }
) {
  useStyle(
    () => css`
      @import '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/default.min.css';
      @import '${url}';
      a {
        color: var(--active-color) !important;
        margin: 0 0.2em;
      }
    `,
    []
  )

  return html`<div class="markdown-body">
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
        pending: html` <skele-ton :title="${false}" :line="${6}"></skele-ton> `,
        delay: 300,
        minHeight: '600px'
      }
    )}
  </div>`
})
