import { html, useStyle, Component, useEffect, useState } from '@gallop/gallop'
import style from './index.scss?inline'

export const Editor: Component = function () {
  useStyle(() => style, [])

  const [state] = useState({ mouse: { x: 0, y: 0 } })

  useEffect(() => {
    document.body.addEventListener('mousemove', (e) => {
      state.mouse.x = e.x
      state.mouse.y = e.y
    })
  }, [])

  return html`
    <re-menu></re-menu>
    <div class="panel-pool">
      <re-area class="$1">
        <div slot="head">111</div>
      </re-area>
      <re-area class="$2"></re-area>
      <re-area class="$3"></re-area>
      <re-area class="$4"></re-area>
    </div>
    <re-footer></re-footer>
    <div class="mouse-track">${JSON.stringify(state.mouse, undefined, 2)}</div>
  `
}
