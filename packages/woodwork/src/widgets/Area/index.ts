import {
  html,
  Component,
  useStyle,
  css,
  useEffect,
  useState,
  queryPoolAll,
  useRef
} from '@gallop/gallop'
import { WW } from '../../core'
import { Area } from '../../core/Area'

import {
  Subject,
  Subscription,
  scheduled,
  partition,
  asapScheduler,
  race,
  merge
} from 'rxjs'
import {
  filter,
  first,
  map,
  distinctUntilChanged,
  share,
  skipUntil,
  skip,
  tap,
  scan
} from 'rxjs/operators'
import { random } from 'lodash'
import { Direction, CornerLocation } from '../../types'
import { useDragDrop } from '../../hooks/useDragDrop'
import { FR_UNIT } from '../../utils/const'

const positions = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { left: 0, bottom: 0 },
  { right: 0, bottom: 0 }
] as const

export const AreaComp: Component = function ({
  area,
  ww
}: {
  area: Area
  ww: WW
}) {
  useStyle(
    () => css`
      :host {
        display: block;
        position: relative;
        background: var(--area-background-color);
        box-sizing: border-box;
        user-select: none;
        height: 100%;
        width: 100%;

        border-radius: var(--area-border-radius);
        overflow: hidden;

        min-width: var(--area-min-width);
        min-height: var(--area-min-heigth);
      }

      .area-root {
        height: 100%;
        width: 100%;
        overflow: hidden;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .area-body {
        overflow: auto;
      }

      .area-head {
        user-select: none;
        height: var(--area-head-height);
        background: var(--area-head-background-color);
        display: grid;
        align-items: center;
        padding: var(--area-head-padding);
        grid-template-columns: auto 1fr;
        column-gap: 10px;
        overflow: hidden;
      }

      ::slotted(*:nth-child(1)) {
        height: 100%;
        width: 100%;
        line-height: var(--area-head-height);
      }

      .area-switcher {
        height: var(--area-switcher-height);
        width: var(--area-switcher-width);
        background: var(--area-switcher-background);
        border-radius: var(--area-switcher-border-radius);
      }

      .area-content {
        height: 100%;
      }

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

  const { key: renderKey } = area

  const [state] = useState<{ view: unknown }>({
    view: undefined
  })

  useEffect(() => {
    const container = this.$root.querySelector<HTMLDivElement>('.area-body')
    if (renderKey && container) {
      const view = ww.viewRegistry.get(renderKey)?.(container)
      if (view) {
        state.view = view
      }
    }
  }, [renderKey])

  useEffect(() => {
    area._dom = this
    const { parent } = area
    if (parent) {
      const index = parent.children.indexOf(area)
      parent.grids[index] =
        (parent.direction === 'horizontal'
          ? this.clientWidth
          : this.clientHeight) / FR_UNIT
    }
  }, [])

  const useDragCorner = ({ size = 15 }: { size?: number } = {}) => {
    useEffect(() => {
      const divs = positions.map((position) => {
        const location = resolveLocation(position)
        const div = document.createElement('div')
        div.classList.add('drag-corner')
        div.dataset.location = String(location)
        div.style.width = `${size}px`
        div.style.height = `${size}px`
        div.style.position = 'absolute'
        div.style.background = 'transparent'
        div.style.cursor = 'crosshair'
        'left' in position && (div.style.left = String(position.left))
        'right' in position && (div.style.right = String(position.right))
        'top' in position && (div.style.top = String(position.top))
        'bottom' in position && (div.style.bottom = String(position.bottom))
        return div
      })

      divs.forEach((div) => this.$root.append(div))
    }, [])

    const dragSubjectRef =
      useRef<Subject<{ event: DragEvent; over: HTMLElement }>>()
    const dragSubscriptionRef = useRef<Subscription>()

    for (const position of positions) {
      const location = resolveLocation(position)
      useDragDrop({
        dragZone: () =>
          this.$root.querySelector(
            `div.drag-corner[data-location='${location}']`
          )!,
        dropZone: () => [...queryPoolAll({ name: this.localName })],
        ondragstart: (e) => {
          const rect = this.getBoundingClientRect()
          const [hori, vert] = location
          const [cx, cy] = [rect[hori], rect[vert]]
          const maxInsideDistance = 60
          const subject = new Subject<{
            event: DragEvent
            over: HTMLElement
            direction?: Direction
          }>()
          dragSubjectRef.current = subject
          const drag$ = scheduled(subject.asObservable(), asapScheduler).pipe(
            distinctUntilChanged(
              (pre, cur) =>
                pre.event.x === cur.event.x && pre.event.y === cur.event.y
            ),
            map((v) => ({ ...v, from: location })),
            share()
          )

          const [dragInside$] = partition(drag$, ({ over }) => over === this)

          // dargInside ==> dragToDivide

          const catchHori$ = dragInside$.pipe(
            first((v) => Math.abs(cx - v.event.x) > maxInsideDistance),
            map((v) => ({ ...v, direction: 'horizontal' as Direction }))
          )
          const catchVert$ = dragInside$.pipe(
            first((v) => Math.abs(cy - v.event.y) > maxInsideDistance),
            map((v) => ({ ...v, direction: 'vertical' as Direction }))
          )

          const catchDirection$ = race(catchHori$, catchVert$).pipe(
            filter((v) => {
              const index = area.parent.children.indexOf(area)
              const grid = area.parent.grids[index]
              return v.direction !== area.parent.direction || grid > 22
            }),
            tap((value) => {
              const { direction, from } = value
              const tracks = area.divide({ direction, from })

              tracks.forEach((track) =>
                ww.renderer.reflowAreaTrack({ areaTrack: track })
              )
            }),
            share()
          )
          const field =
            area.parent.direction === 'horizontal'
              ? 'clientWidth'
              : 'clientHeight'
          //
          let initLenMap: number[]

          const dragToDivide$ = merge(catchDirection$, drag$).pipe(
            scan((acc, cur) => ({
              ...cur,
              direction: cur.direction ?? acc.direction
            })),
            skipUntil(catchDirection$),
            filter(() => {
              const prepared = !area.parent.children.some(
                (child) => !child._dom
              )
              if (!initLenMap && prepared) {
                // console.log(event)
                initLenMap = area.parent.children.map(
                  (child) => child._dom![field]
                )
              }
              return prepared
            }),
            map((v) => ({
              ...v,
              type: 'divide' as const,
              offset:
                area.parent.direction === 'horizontal'
                  ? v.event.clientX - e.clientX
                  : v.event.clientY - e.clientY
            })),
            filter((v) => {
              const { offset, from } = v
              const indexedOffset =
                calcIndexOffset(area.parent.direction, from) * -1 * offset
              const index = area.parent.children.indexOf(area)
              return (
                indexedOffset > maxInsideDistance &&
                indexedOffset < initLenMap[index]
              )
            }),
            tap(({ from, offset }) => {
              // console.log(offset)
              const lenMap = area.parent.children.map((v) => v._dom![field])

              const index = area.parent.children.indexOf(area)

              const indexOffset = calcIndexOffset(area.parent.direction, from)
              lenMap[index] =
                initLenMap[index] +
                (offset + maxInsideDistance * indexOffset) * indexOffset
              lenMap[index + indexOffset] =
                initLenMap[index + indexOffset] -
                (offset + maxInsideDistance * indexOffset) * indexOffset

              const grids = lenMap.map((len) => len / FR_UNIT)
              // console.log(grids)
              ww.renderer.reflowAreaTrack({
                areaTrack: area.parent,
                grids
              })
            })
          )

          // dragOutside ==> dragToMerge

          const dragToMerge$ = drag$
            .pipe(
              distinctUntilChanged((pre, cur) => pre.over === cur.over),
              skip(1)
            )
            .pipe(
              tap(({ over }) => {
                const inSameTrack = !!~area.parent.children
                  .map((v) => v._dom)
                  .indexOf(over)
                if (inSameTrack) {
                  // TODO
                }
              })
            )
          //

          const dragCorner$ = race(dragToDivide$, dragToMerge$).pipe()

          dragSubscriptionRef.current = dragCorner$.subscribe()
        },
        ondragover: (event, over) => {
          dragSubjectRef.current?.next({ event, over })
        },
        ondragend: () => {
          dragSubjectRef.current = undefined
          dragSubscriptionRef.current?.unsubscribe()
        }
      })
    }
  }

  useDragCorner()

  return html`
    <div class="area-root">
      <div class="area-head">
        <div
          class="area-switcher"
          @click="${() => {
            // dropdown({ trigger: e.target! })
          }}"
        ></div>
        <slot name="head"> </slot>
      </div>
      <div class="area-body">${state.view}</div>
    </div>
  `
}

const resolveLocation = (position: typeof positions[number]) => {
  return Object.keys(position) as CornerLocation
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

const calcIndexOffset = (direction: Direction, from: CornerLocation) => {
  let indexOffset: number
  if (direction === 'horizontal') {
    const [h] = from
    if (h === 'left') {
      indexOffset = -1
    } else {
      indexOffset = 1
    }
  } else {
    const [, v] = from
    if (v === 'top') {
      indexOffset = -1
    } else {
      indexOffset = 1
    }
  }
  return indexOffset
}
