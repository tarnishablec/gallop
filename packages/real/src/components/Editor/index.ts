import {
  html,
  ReactiveElement,
  useEffect,
  useState,
  useStyle
} from '@gallop/gallop'
import style from './index.scss?inline'

export const Editor = function (this: ReactiveElement) {
  useStyle(() => style, [])

  const [state] = useState({
    mouse: {
      x: 0,
      y: 0
    }
  })

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      state.mouse = { x: e.x, y: e.y }
    })
  }, [])

  return html`
    <div class="panel-pool">
      <re-panel :width="600px" :height="600px"></re-panel>
    </div>
  `
}
