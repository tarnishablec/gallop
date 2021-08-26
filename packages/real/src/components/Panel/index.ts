import { css, html, ReactiveElement, useStyle, queryPool } from '@gallop/gallop'
import style from './index.scss?inline'

import { useDragDrop } from '@real/hooks/useDragDrop'

export type PanelPropType = {
  minHeight: string
  minWidth: string
  maxHeight: string
  maxWidth: string
  heigth: string
  width: string
}

export const Panel = function (this: ReactiveElement, props: PanelPropType) {
  const {
    minHeight = '300px',
    minWidth = '300px',
    maxHeight = '300px',
    maxWidth = '300px',
    heigth = '300px',
    width = '300px'
  } = props

  // const [state] = useState({ activedDock: '' })

  useStyle(() => style, [])
  useStyle(
    () => css`
      :host {
        height: ${heigth};
        width: ${width};
        min-height: ${minHeight};
        min-width: ${minWidth};
        max-height: ${maxHeight};
        max-width: ${maxWidth};
      }
    `,
    []
  )

  useDragDrop({
    excludeZone: () => this.$root.querySelectorAll('.panel-body'),
    dropZone: () =>
      queryPool({ name: 're-editor' })!.$root.querySelectorAll('.panel-pool')!
  })

  return html`
    <div class="panel">
      <div class="panel-head"></div>
      <div class="panel-body"></div>
    </div>
  `
}
