import { useEffect, Looper, queryPoolAll, useRef } from '@gallop/gallop'
import { useDragDrop } from './useDragDrop'
import {
  race,
  scheduled,
  animationFrameScheduler,
  merge,
  Subject,
  Subscription,
  partition
} from 'rxjs'
import {
  skipUntil,
  distinctUntilChanged,
  share,
  first,
  filter,
  skip,
  map
} from 'rxjs/operators'
import { CornerLocation, Direction } from '@real/utils/type'

const positions = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { left: 0, bottom: 0 },
  { right: 0, bottom: 0 }
] as const

export const useDragCorner = ({ size = 15 }: { size?: number } = {}) => {
  const current = Looper.resolveCurrentElement()

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

    divs.forEach((div) => current.$root.append(div))
  }, [])

  const dragSubjectRef =
    useRef<Subject<{ event: DragEvent; over: HTMLElement }>>()
  const dragSubscriptionRef = useRef<Subscription>()

  for (const position of positions) {
    const location = resolveLocation(position)
    useDragDrop({
      dragZone: () =>
        current.$root.querySelector(
          `div.drag-corner[data-location='${location}']`
        )!,
      dropZone: () => [...queryPoolAll({ name: current.localName })],
      ondragstart: () => {
        const rect = current.getBoundingClientRect()
        const [hori, vert] = location
        const [cx, cy] = [rect[hori], rect[vert]]
        const maxInsideDistance = 50
        const subject = new Subject<{ event: DragEvent; over: HTMLElement }>()
        dragSubjectRef.current = subject
        const drag$ = scheduled(
          subject.asObservable(),
          animationFrameScheduler
        ).pipe(
          distinctUntilChanged(
            (pre, cur) =>
              pre.event.x === cur.event.x && pre.event.y === cur.event.y
          ),
          map((v) => ({ ...v, from: location })),
          share()
        )

        const [dragInside$] = partition(drag$, ({ over }) => over === current)

        // dargInside ==> dragToDivide

        const catchHori$ = dragInside$.pipe(
          first((v) => Math.abs(cx - v.event.x) > maxInsideDistance),
          map((v) => ({ ...v, direction: 'horizontal' as Direction }))
        )
        const catchVert$ = dragInside$.pipe(
          first((v) => Math.abs(cy - v.event.y) > maxInsideDistance),
          map((v) => ({ ...v, direction: 'vertical' as Direction }))
        )
        const catchDirection$ = race(catchHori$, catchVert$)

        const dragToDivide$ = merge(
          catchDirection$,
          dragInside$.pipe(skipUntil(catchDirection$))
        )

        // dragOutside ==> dragToMerge

        const dragToMerge$ = drag$.pipe(
          filter(() => true), // TODO
          distinctUntilChanged((pre, cur) => pre.over === cur.over),
          skip(1)
        )
        //

        const dragCorner$ = race(dragToDivide$, dragToMerge$).pipe()

        dragSubscriptionRef.current = dragCorner$.subscribe({
          next: console.log
        })
      },
      ondragover: (event, over) =>
        dragSubjectRef.current?.next({ event, over }),
      ondragleave: () => {},
      ondragend: () => {
        dragSubjectRef.current = undefined
        dragSubscriptionRef.current?.unsubscribe()
      },
      ondrop: (e, target) => console.log('drop', e, target)
    })
  }
}

const resolveLocation = (position: typeof positions[number]) => {
  return Object.keys(position) as CornerLocation
}
