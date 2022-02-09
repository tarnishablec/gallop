import {
  Component,
  css,
  html,
  useStyle,
  useRef,
  useEffect
} from '@gallop/gallop'
import { WW } from '../../core'
import { AreaDragger } from '../../core/AreaDragger'
import { useDragDrop } from '../../hooks/useDragDrop'
import { Subject, Subscription, scheduled, asapScheduler } from 'rxjs'
import { distinctUntilChanged, share, map, filter } from 'rxjs/operators'
import { FR_UNIT } from '../../utils/const'

export const AreaDraggerComp: Component = function ({
  areaDragger,
  ww
}: {
  areaDragger: AreaDragger
  ww: WW
}) {
  const { direction } = areaDragger

  const dragSubjectRef =
    useRef<Subject<{ event: DragEvent; over: HTMLElement }>>()
  const dragSubscriptionRef = useRef<Subscription>()

  useEffect(() => {
    areaDragger._dom = this
  }, [])

  useDragDrop({
    dragZone: () => this,
    dropZone: () => [document.body],
    ondragend: () => {
      dragSubjectRef.current = undefined
      dragSubscriptionRef.current?.unsubscribe()
    },
    ondragover: (event, over) => {
      dragSubjectRef.current?.next({ event, over })
    },
    ondragstart: (e) => {
      const { children, draggers } = areaDragger.parent
      const field = direction === 'horizontal' ? 'clientWidth' : 'clientHeight'
      const initLenMap = areaDragger.parent.children.map((v) => v._dom![field])

      const index = draggers.indexOf(areaDragger)

      const frontIndex = index
      const afterIndex = index + 1

      const subject = new Subject<{ event: DragEvent; over: HTMLElement }>()
      dragSubjectRef.current = subject
      const drag$ = scheduled(subject.asObservable(), asapScheduler).pipe(
        distinctUntilChanged((pre, cur) => {
          return direction === 'horizontal'
            ? pre.event.clientX === cur.event.clientX
            : pre.event.clientY === cur.event.clientY
        }),
        map((cur) => {
          return {
            direction,
            offset:
              direction === 'horizontal'
                ? cur.event.clientX - e.clientX
                : cur.event.clientY - e.clientY
          }
        }),
        filter((v) => {
          return (
            v.offset < initLenMap[afterIndex] - 47 &&
            v.offset > -(initLenMap[frontIndex] - 47)
          )
        }),
        share()
      )
      dragSubscriptionRef.current = drag$.subscribe({
        next: ({ offset }) => {
          // grids = grids.filter((v, index) => index % 2)
          const lenMap = children.map((v) => v._dom?.[field])
          lenMap[frontIndex] = initLenMap[frontIndex]! + offset
          lenMap[afterIndex] = initLenMap[afterIndex]! - offset
          // console.log(initLenMap)
          const frMap = lenMap.map((v) => v! / FR_UNIT)
          ww.renderer.reflowAreaTrack({
            areaTrack: areaDragger.parent,
            grids: frMap
          })
        }
      })
    }
  })

  useStyle(() => {
    return css`
      :host {
        width: 100%;
        height: 100%;
        cursor: ${direction === 'horizontal' ? 'col-resize' : 'row-resize'};
      }
    `
  }, [])

  return html`<div class="ww-area-dragger-root"></div>`
}
