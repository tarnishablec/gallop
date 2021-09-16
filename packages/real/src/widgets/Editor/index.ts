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
      <re-dock class="$1">
        <div slot="head">111</div>
      </re-dock>
      <re-dock class="$2"></re-dock>
      <re-dock class="$3"></re-dock>
      <re-dock class="$4"></re-dock>
    </div>
    <re-footer></re-footer>
    <div class="mouse-track">${JSON.stringify(state.mouse, undefined, 2)}</div>
  `
}
