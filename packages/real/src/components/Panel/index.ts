import { css, html, ReactiveElement, useStyle } from '@gallop/gallop'

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
