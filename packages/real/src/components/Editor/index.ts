import { html, ReactiveElement, useStyle } from '@gallop/gallop'
import style from './index.scss?inline'

export const Editor = function (this: ReactiveElement) {
  useStyle(() => style, [])

  return html`
    <re-menu></re-menu>
    <div class="panel-pool">
      <re-panel class="$1"></re-panel>
    </div>
  `
}
