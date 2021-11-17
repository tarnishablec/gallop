import { html, Component, useStyle } from '@gallop/gallop'

import { useMonaco } from '@real/hooks/useMonaco'
import { useDragCorner } from '@real/hooks/useDragCorner'

import code from '../../hooks/useDragDrop?raw'
import style from './index.scss?inline'

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

export const dropdown = ({
  trigger,
  overlay = {
    width: 800,
    height: 300
  }
}: {
  trigger: HTMLElement | EventTarget
  overlay?: Partial<{
    width: number
    height: number
  }>
}) => {
  if (!(trigger instanceof HTMLElement)) return

  // const { width = 800, height = 300 } = overlay ?? {}

  const rect = trigger.getBoundingClientRect()
  const { left, bottom } = rect

  const position = { x: left, y: bottom }

  const offset = 0

  const wrapper = document.createElement('div')

  const overlayPool = document.createElement('div')
  overlayPool.style.height = '100%'
  overlayPool.style.width = '100%'
  overlayPool.style.position = 'fixed'
  overlayPool.style.top = '0'
  overlayPool.style.left = '0'
  overlayPool.style.pointerEvents = 'none'
  document.body.append(overlayPool)

  //

  wrapper.style.position = 'absolute'
  wrapper.style.width = `${overlay.width}px`
  wrapper.style.height = `${overlay.height}px`
  wrapper.style.top = `${position.y + offset}px`
  wrapper.style.left = `${position.x}px`
  wrapper.style.background = 'rgba(0,0,0,0.7)'
  wrapper.style.pointerEvents = 'auto'
  wrapper.style.borderRadius = '5px'
  // wrapper.style.visibility = 'hidden'

  overlayPool.append(wrapper)

  // const poolRect = overlayPool.getBoundingClientRect()
  // const wrapperRect = wrapper.getBoundingClientRect()
}
