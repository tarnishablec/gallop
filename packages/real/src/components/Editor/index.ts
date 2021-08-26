import { html, ReactiveElement, useStyle } from '@gallop/gallop'
import style from './index.scss?inline'

export const Editor = function (this: ReactiveElement) {
  useStyle(() => style, [])

  return html`
    <div class="panel-pool">
      <re-panel></re-panel>
      <re-panel></re-panel>
    </div>
  `
}
