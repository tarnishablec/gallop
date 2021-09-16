import { html, Component, useStyle } from '@gallop/gallop'

import { useMonaco } from '@real/hooks/useMonaco'
import { useDragCorner } from '@real/hooks/useDragCorner'

import code from '../../hooks/useDragDrop?raw'
import style from './index.scss?inline'

import { dropdown } from '@real/utils'

export const Dock: Component = function () {
  useStyle(() => style, [])

  useMonaco({
    container: () => this.$root.querySelector('.dock-body')!,
    options: {
      value: code
    }
  })

  useDragCorner()

  return html`
    <div class="dock-root">
      <div class="dock-head">
        <div
          class="dock-switcher"
          @click="${(e: MouseEvent) => {
            dropdown({ trigger: e.target! })
          }}"
        ></div>
        <slot name="head"> </slot>
      </div>
      <div class="dock-body"></div>
    </div>
  `
}
