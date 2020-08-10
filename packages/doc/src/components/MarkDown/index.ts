import {
  component,
  html,
  raw,
  ReactiveElement,
  useStyle,
  css,
  suspense
} from '@gallop/gallop'
import MarkDownWorker from 'worker-loader!@gallop/doc/worker/markdown.worker'
import url from './github.css?url'

component('mark-down', function (
  this: ReactiveElement,
  {
    filename,
    locale = 'zh'
  }: {
    filename: string
    locale?: string
  } /* filename do not need .md extension */
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
    ${suspense(
      async () => {
        let content: string
        try {
          content = (
            await import(
              /* webpackChunkName: "md/mdcontents" */
              /* webpackMode: "eager" */
              `../../markdown/${locale}/${filename}.md`
            )
          ).default
        } catch (e) {
          content = (
            await import(
              /* webpackChunkName: "md/mdcontents" */
              /* webpackMode: "eager" */
              `../../markdown/zh/${filename}.md`
            )
          ).default
        }
        const worker = new MarkDownWorker()
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
        pending: () =>
          html` <skele-ton :title="${false}" :line="${6}"></skele-ton> `,
        depends: [filename, locale]
      }
    )}
  </div>`
})
