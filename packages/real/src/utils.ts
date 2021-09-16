export type Direction = 'row' | 'column'
export type CornerLocation = ['left' | 'right', 'top' | 'bottom']

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
  const { left, top, bottom, right } = rect

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

  const poolRect = overlayPool.getBoundingClientRect()
  const wrapperRect = wrapper.getBoundingClientRect()


 
}
