import { Looper, useEffect } from '@gallop/gallop'
import { useStaticEffect } from './useStaticEffect'

export type ZoneUnits = HTMLElement[] | NodeListOf<HTMLElement>
// let dragged: ReactiveElement | undefined
/** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#define_a_drop_zone */
export const useDragDrop = ({
  excludeZone,
  dropZone
}: {
  excludeZone?: () => ZoneUnits
  dropZone: () => ZoneUnits
}) => {
  const current = Looper.resolveCurrentElement()

  useEffect(() => {
    current.draggable = true
    // current.addEventListener('dragstart', () => (dragged = current))
    // current.addEventListener('dragend', () => (dragged = undefined))
  }, [])

  useStaticEffect(() => {
    const targets = Array.from(dropZone())
    const excludes = Array.from(excludeZone?.() ?? [])
    targets.forEach((target) => {
      target.addEventListener('drop', (e) => {
        e.preventDefault()
        console.log(current)
      })
      target.addEventListener('dragover', (e) => {
        e.preventDefault()
      })
    })

    excludes.forEach((exclude) => {
      exclude.addEventListener('mouseenter', () => (current.draggable = false))
      exclude.addEventListener('mouseleave', () => (current.draggable = true))
    })
  })
}

export const makeDropZone = () => {
  // TODO
}
