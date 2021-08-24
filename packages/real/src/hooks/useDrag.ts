import { Looper, useEffect, useHookCount } from '@gallop/gallop'

let dragged: HTMLElement | undefined
const keySet: Array<{ tagName: string; count: number }> = []

type DragUnits = HTMLElement[] | NodeListOf<HTMLElement>

export const useDragDrop = ({
  excludeZone,
  dropZone,
  ondrop,
  ondragStart
}: {
  excludeZone?: () => DragUnits
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#define_a_drop_zone */
  dropZone: () => DragUnits
  ondrop?: (dragged: HTMLElement, target: HTMLElement) => void
  ondragStart?: (targets: DragUnits) => void
}) => {
  const current = Looper.resolveCurrentElement()
  const { tagName } = current
  const count = useHookCount()
  const key = { count, tagName }

  useEffect(() => {
    current.draggable = true

    const targets = Array.from(dropZone()).filter(Boolean)
    const _excludes = Array.from(excludeZone?.() ?? []).filter(Boolean)
    current.addEventListener('dragstart', (e) => {
      e.dataTransfer!.dropEffect = 'move'
      dragged = current
      ondragStart?.(targets)
    })

    current.addEventListener('dragend', () => {
      dragged = undefined
    })

    if (!keySet.some((v) => v.count === count && v.tagName === tagName)) {
      for (const exclude of _excludes) {
        exclude.addEventListener('mouseenter', (e) => {
          e.stopPropagation()
          current.draggable = false
        })
        exclude.addEventListener('mouseleave', () => {
          current.draggable = true
        })
      }

      for (const target of targets) {
        target.addEventListener('drop', (e) => {
          e.preventDefault()
          dragged &&
            e.target instanceof HTMLElement &&
            ondrop?.(dragged, e.target)
        })

        target.addEventListener('dragover', (e) => {
          e.preventDefault()
        })
      }
      keySet.push(key)
    }

    return () => {
      const index = keySet.findIndex(
        (v) => v.count === count && v.tagName === tagName
      )
      keySet.splice(index, 1)
    }
  }, [])
}
