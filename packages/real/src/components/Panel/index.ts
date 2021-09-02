import {
  css,
  html,
  ReactiveElement,
  useStyle,
  queryPool,
  useRef,
  useEffect
} from '@gallop/gallop'
import style from './index.scss?inline'
import monacoStyle from 'monaco-editor/min/vs/editor/editor.main.css?inline'

import { useDragDrop } from '@real/hooks/useDragDrop'
import { createMonaco } from '@real/monaco'

export type PanelPropType = {
  // minHeight: string
  // minWidth: string
  // maxHeight: string
  // maxWidth: string
  height: string
  width: string
}

export const Panel = function (this: ReactiveElement, props: PanelPropType) {
  const { height = '300px', width = '300px' } = props

  // const [state] = useState({ activedDock: '' })

  useStyle(() => style, [])
  useStyle(() => monacoStyle, [])
  useStyle(
    () => css`
      :host {
        height: ${height};
        width: ${width};
      }
    `,
    []
  )

  const dragRef = useRef({
    dragInfo: {
      mouseOffset: {
        x: 0,
        y: 0
      }
    }
  })

  useDragDrop({
    ondragstart: (e) => {
      this.style.position = 'absolute'
      const rect = this.getBoundingClientRect()
      dragRef.current.dragInfo.mouseOffset = {
        x: e.x - rect.x,
        y: e.y - rect.y
      }
    },
    ondrop: (e) => {
      const { mouseOffset } = dragRef.current.dragInfo
      this.style.left = e.x - mouseOffset.x + 'px'
      this.style.top = e.y - mouseOffset.y + 'px'
    },
    excludeZone: () => this.$root.querySelectorAll('.panel-body'),
    dropZone: () =>
      queryPool({ name: 're-editor' })!.$root.querySelectorAll('.panel-pool')!
  })

  useEffect(() => {
    createMonaco(this.$root.querySelector('.panel-body')!)
  }, [])

  return html`
    <div class="panel">
      <div class="panel-head"></div>
      <div class="panel-body"></div>
    </div>
  `
}
