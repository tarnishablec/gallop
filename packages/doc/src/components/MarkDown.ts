import { component, html, suspense } from '@gallop/gallop'
import MarkDownWoker from 'worker-loader!@gallop/doc/worker/markdown.worker'

const worker = new MarkDownWoker()

const importMd: (filename: string) => Promise<{ default: string }> = (
  path: string
) => require.context('../markdown', false, /\.md$/, 'lazy')(`./${path}`)

component('mark-down', function ({ filename }: { filename: string }) {
  return html`<div>
    ${suspense(async () => {
      const content = (await importMd(filename)).default
      worker.postMessage(content)
    })}
  </div>`
})
