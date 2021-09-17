import { html, Component, useStyle } from '@gallop/gallop'

import { useMonaco } from '@real/hooks/useMonaco'
import { useDragCorner } from '@real/hooks/useDragCorner'

import code from '../../hooks/useDragDrop?raw'
import style from './index.scss?inline'

import { dropdown } from '@real/utils'

export const Area: Component = function () {
  useStyle(() => style, [])

  useMonaco({
    container: () => this.$root.querySelector('.area-body')!,
    options: {
      value: code
    }
  })

  useDragCorner()

  return html`
    <div class="area-root">
      <div class="area-head">
        <div
          class="area-switcher"
          @click="${(e: MouseEvent) => {
            dropdown({ trigger: e.target! })
          }}"
        ></div>
        <slot name="head"> </slot>
      </div>
      <div class="area-body"></div>
    </div>
  `
}
