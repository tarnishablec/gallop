import { Looper, useEffect, useHookCount } from '@gallop/gallop'

let dragged: HTMLElement | undefined
const keySet: Array<{ tagName: string; count: number }> = []

export const useDragDrop = ({
  dragZone,
  dropZone,
  ondrop
}: {
  dragZone: () => HTMLElement
  dropZone: () => HTMLElement[] | NodeListOf<HTMLElement>
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#define_a_drop_zone */
  ondrop: (dropped: HTMLElement) => void
}) => {
  const current = Looper.resolveCurrentElement()
  const { tagName } = current
  const count = useHookCount()
  const key = { count, tagName }

  useEffect(() => {
    const _trigger = dragZone()
    _trigger.draggable = true

    const _containers = Array.from(dropZone())

    _trigger.addEventListener('dragstart', () => {
      dragged = current
    })

    _trigger.addEventListener('dragend', () => {
      dragged = undefined
    })

    if (!keySet.some((v) => v.count === count && v.tagName === tagName)) {
      for (const container of _containers) {
        container.addEventListener('drop', (e) => {
          e.preventDefault()
          console.log(e)
          dragged && ondrop(dragged)
        })

        container.addEventListener('dragover', (e) => {
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
