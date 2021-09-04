import { useEffect, Looper, queryPoolAll } from '@gallop/gallop'
import { useDragDrop } from './useDragDrop'

const positions = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { left: 0, bottom: 0 },
  { right: 0, bottom: 0 }
] as const

export const useCorner = ({ size = 8 }: { size?: number } = {}) => {
  const current = Looper.resolveCurrentElement()

  useEffect(() => {
    const divs = positions.map((position) => {
      const pos = resolvePosition(position)
      const div = document.createElement('div')
      div.classList.add(`corner-${pos}`)
      div.dataset.pos = pos
      div.style.width = `${size}px`
      div.style.height = `${size}px`
      div.style.position = 'absolute'
      div.style.background = 'transparent'
      // div.style.background = 'white'
      div.style.cursor = 'all-scroll'
      'left' in position && (div.style.left = String(position.left))
      'right' in position && (div.style.right = String(position.right))
      'top' in position && (div.style.top = String(position.top))
      'bottom' in position && (div.style.bottom = String(position.bottom))
      return div
    })

    divs.forEach((div) => current.$root.append(div))
  }, [])

  for (const position of positions) {
    useDragDrop({
      dragZone: () =>
        current.$root.querySelector(`div.corner-${resolvePosition(position)}`)!,
      dropZone: () => [...queryPoolAll({ name: 're-panel' })],
      // ondrag: (e) => console.log('drag', e),
      ondragover: (e, target) => {
        target.style.borderColor = 'red'
        console.log(target === current)
      },
      ondragleave: (e, target) => {
        target.style.borderColor = ''
        console.log('leave', target)
      },
      // ondrag: console.log,
      ondrop: (e) => console.log('drop', e)
    })
  }
}

const resolvePosition = (position: typeof positions[number]) => {
  let result = ''
  for (const key in position) {
    result += key[0]
  }
  return result
}
