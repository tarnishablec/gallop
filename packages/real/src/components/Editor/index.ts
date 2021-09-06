import { html, useStyle, Component } from '@gallop/gallop'
import style from './index.scss?inline'

export const Editor: Component = function () {
  useStyle(() => style, [])

  return html`
    <re-menu></re-menu>
    <div class="panel-pool">
      <re-panel class="$1"></re-panel>
    </div>
  `
}
