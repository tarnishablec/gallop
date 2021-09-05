import { useEffect, Looper, queryPoolAll, useRef } from '@gallop/gallop'
import { useDragDrop } from './useDragDrop'
import { BehaviorSubject } from 'rxjs'

const positions = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { left: 0, bottom: 0 },
  { right: 0, bottom: 0 }
] as const

export const useDragCorner = ({ size = 10 }: { size?: number } = {}) => {
  const current = Looper.resolveCurrentElement()

  useEffect(() => {
    const divs = positions.map((position) => {
      const pos = resolvePosition(position)
      const div = document.createElement('div')
      div.classList.add('drag-corner')
      div.dataset.pos = String(pos)
      div.style.width = `${size}px`
      div.style.height = `${size}px`
      div.style.position = 'absolute'
      div.style.background = 'transparent'
      div.style.cursor = 'all-scroll'
      'left' in position && (div.style.left = String(position.left))
      'right' in position && (div.style.right = String(position.right))
      'top' in position && (div.style.top = String(position.top))
      'bottom' in position && (div.style.bottom = String(position.bottom))
      return div
    })

    divs.forEach((div) => current.$root.append(div))
  }, [])

  const dragInfo = useRef<{
    start?: [number, number]
    direction?: 'horizontal' | 'vertical'
    subject?: BehaviorSubject<{ x: number; y: number }>
  }>({})

  for (const position of positions) {
    const pos = resolvePosition(position)
    useDragDrop({
      dragZone: () =>
        current.$root.querySelector(`div.drag-corner[data-pos='${pos}']`)!,
      dropZone: () => [...queryPoolAll({ name: 're-panel' })],
      ondragstart: (e) => {
        const rect = current.getBoundingClientRect()
        const [hor, vet] = pos
        dragInfo.current.start = [rect[hor], rect[vet]]
        const subject = new BehaviorSubject({ x: e.x, y: e.y })
        dragInfo.current.subject = subject
      },
      ondragover: (e) => {
        const maxDis = 30
        const { x, y } = e
        const [sx, sy] = dragInfo.current.start!
        const direction = dragInfo.current.direction
        if (!direction) {
          if (Math.abs(x - sx) > maxDis) {
            dragInfo.current.direction = 'horizontal'
          } else if (Math.abs(y - sy) > maxDis) {
            dragInfo.current.direction = 'vertical'
          }
        }
      },
      ondragleave: () => {},
      // ondrag: console.log,
      ondrop: (e) => console.log('drop', e)
    })
  }
}

const resolvePosition = (position: typeof positions[number]) => {
  return Object.keys(position) as ['left' | 'right', 'top' | 'bottom']
}
