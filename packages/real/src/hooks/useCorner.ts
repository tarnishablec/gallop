import { useEffect, Looper } from '@gallop/gallop'

const positions = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { left: 0, bottom: 0 },
  { right: 0, bottom: 0 }
] as const

export const useCorner = ({ size = 6 }: { size?: number } = {}) => {
  const current = Looper.resolveCurrentElement()

  useEffect(() => {
    const divs = positions.map(() => {
      const div = document.createElement('div')
      div.style.width = `${size}px`
      div.style.height = `${size}px`
      div.style.position = 'absolute'
      div.style.background = 'white'
      div.style.cursor = 'crosshair'
      return div
    })

    positions.forEach((pos, index) => {
      const div = divs[index]
      'left' in pos && (div.style.left = String(pos.left))
      'right' in pos && (div.style.right = String(pos.right))
      'top' in pos && (div.style.top = String(pos.top))
      'bottom' in pos && (div.style.bottom = String(pos.bottom))
      current.$root.append(div)
    })
  }, [])
}
