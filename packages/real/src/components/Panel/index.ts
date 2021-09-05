import { html, ReactiveElement, useStyle } from '@gallop/gallop'

import { useMonaco } from '@real/hooks/useMonaco'
import { useDragCorner } from '@real/hooks/useDragCorner'

import code from '../../hooks/useDragDrop?raw'
import style from './index.scss?inline'

export type PanelPropType = {}

export const Panel = function (this: ReactiveElement) {
  useStyle(() => style, [])

  useMonaco({
    container: () => this.$root.querySelector('.panel-body')!,
    options: {
      value: code
    }
  })

  useDragCorner()

  return html`
    <div class="panel">
      <div class="panel-head"></div>
      <div class="panel-body"></div>
    </div>
  `
}
