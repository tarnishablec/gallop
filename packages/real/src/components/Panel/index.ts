import {
  css,
  html,
  ReactiveElement,
  useStyle
  // queryPool,
  // useRef
} from '@gallop/gallop'

// import { useDragDrop } from '@real/hooks/useDragDrop'
import { useMonaco } from '@real/hooks/useMonaco'
import { useCorner } from '@real/hooks/useCorner'

import code from '../../hooks/useDragDrop?raw'
import style from './index.scss?inline'

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
  useStyle(
    () => css`
      :host {
        height: ${height};
        width: ${width};
      }
    `,
    []
  )

  // const dragRef = useRef({
  //   dragInfo: {
  //     mouseOffset: {
  //       x: 0,
  //       y: 0
  //     }
  //   }
  // })

  // useDragDrop({
  //   dragZone: () => this.$root.querySelector('.panel-head')!,
  //   ondragstart: (e) => {
  //     this.style.position = 'absolute'
  //     const rect = this.getBoundingClientRect()
  //     dragRef.current.dragInfo.mouseOffset = {
  //       x: e.x - rect.x,
  //       y: e.y - rect.y
  //     }
  //   },
  //   // ondrop: (e) => {
  //   //   const { mouseOffset } = dragRef.current.dragInfo
  //   //   this.style.left = e.x - mouseOffset.x + 'px'
  //   //   this.style.top = e.y - mouseOffset.y + 'px'
  //   // },
  //   ondrag: (e) => {
  //     const { mouseOffset } = dragRef.current.dragInfo
  //     this.style.left = e.x - mouseOffset.x + 'px'
  //     this.style.top = e.y - mouseOffset.y + 'px'
  //   },
  //   excludeZone: () => this.$root.querySelectorAll('.panel-body'),
  //   dropZone: () =>
  //     queryPool({ name: 're-editor' })!.$root.querySelectorAll('.panel-pool')!
  // })

  useMonaco({
    container: () => this.$root.querySelector('.panel-body')!,
    options: {
      value: code
    }
  })

  useCorner()

  return html`
    <div class="panel">
      <div class="panel-head"></div>
      <div class="panel-body"></div>
    </div>
  `
}
