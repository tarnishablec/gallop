import {
  html,
  Component,
  useStyle,
  css,
  useEffect,
  useState
} from '@gallop/gallop'
import { WW } from '../../core'
import { Area } from '../../core/Area'
import { random } from 'lodash'

import { useDragCorner } from '../../hooks/useDragCorner'

import style from './index.scss?inline'

export const AreaComp: Component = function ({
  area,
  ww
}: {
  area: Area
  ww: WW
}) {
  useStyle(
    () => css`
      ${style}

      :host {
        background: rgb(
          ${random(0, 255)},
          ${random(0, 255)},
          ${random(0, 255)}
        );
      }
    `,
    []
  )

  useDragCorner()

  const { renderKey } = area

  const [state] = useState<{ view: unknown }>({
    view: undefined
  })

  useEffect(() => {
    const container = this.$root.querySelector('.area-body')! as HTMLDivElement
    if (renderKey) {
      const view = ww.viewRegistry.get(renderKey)?.(container)
      if (view) {
        state.view = view
      }
    }
  }, [renderKey])

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
      <div class="area-body">${state.view}</div>
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
