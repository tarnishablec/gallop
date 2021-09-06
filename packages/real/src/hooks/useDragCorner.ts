import { useEffect, Looper, queryPoolAll, useRef } from '@gallop/gallop'
import { useDragDrop } from './useDragDrop'
import { BehaviorSubject, share, race, first, tap, map } from 'rxjs'
import { Direction } from '@real/utils'

export type CornerLocation = ['left' | 'right', 'top' | 'right']

const positions = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { left: 0, bottom: 0 },
  { right: 0, bottom: 0 }
] as const

type DragInfo = { x: number; y: number; direction?: Direction }

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

  const dragSubject = useRef<BehaviorSubject<DragInfo>>()

  for (const position of positions) {
    const location = resolveLocation(position)
    useDragDrop({
      dragZone: () =>
        current.$root.querySelector(
          `div.drag-corner[data-location='${location}']`
        )!,
      dropZone: () => [...queryPoolAll({ name: 're-panel' })],
      ondragstart: (e) => {
        const rect = current.getBoundingClientRect()
        const [hori, vert] = location
        const [cx, cy] = [rect[hori], rect[vert]]
        const maxDistance = 30
        const subject = new BehaviorSubject<DragInfo>({ x: e.x, y: e.y })
        dragSubject.current = subject
        const drag$ = subject.asObservable().pipe(share())
        const catchHori$ = drag$.pipe(
          first((v) => Math.abs(cx - v.x) > maxDistance),
          map((v) => ({ ...v, direction: 'horizontal' } as DragInfo))
        )
        const catchVert$ = drag$.pipe(
          first((v) => Math.abs(cy - v.y) > maxDistance),
          map((v) => ({ ...v, direction: 'vertical' } as DragInfo))
        )
        const catchDirection$ = race(catchHori$, catchVert$).pipe(
          tap((v) => console.log(v.direction))
        )
        catchDirection$.subscribe(console.log)
      },
      ondragover: (e) => {
        const { x, y } = e
        dragSubject.current?.next({ x, y })
      },
      ondragend: () => {
        dragSubject.current = undefined
      },
      ondragleave: () => {},
      // ondrag: console.log,
      ondrop: (e) => console.log('drop', e)
    })
  }
}

const resolveLocation = (position: typeof positions[number]) => {
  return Object.keys(position) as CornerLocation
}
