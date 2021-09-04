import { Looper, useEffect } from '@gallop/gallop'

export type ZoneUnits = HTMLElement[] | NodeListOf<HTMLElement>

/** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#define_a_drop_zone */
export const useDragDrop = ({
  excludeZone,
  dropZone,
  ondrop,
  dragZone,
  ondragstart,
  ondragend,
  ondragover,
  ondrag,
  ondragenter,
  ondragleave,
  delegateDom = () => document.body
}: {
  excludeZone?: () => ZoneUnits
  dropZone: () => ZoneUnits
  dragZone?: () => ZoneUnits[number]
  ondragstart?: (e: DragEvent, target: HTMLElement) => unknown
  ondragend?: (e: DragEvent, target: HTMLElement) => unknown
  ondrag?: (e: DragEvent, target: HTMLElement) => unknown
  ondrop?: (e: DragEvent, target: HTMLElement) => unknown
  ondragenter?: (e: DragEvent, target: HTMLElement) => unknown
  ondragover?: (e: DragEvent, target: HTMLElement) => unknown
  ondragleave?: (e: DragEvent, target: HTMLElement) => unknown
  delegateDom?: () => HTMLElement
}) => {
  const current = Looper.resolveCurrentElement()

  useEffect(() => {
    const draggedItem = dragZone?.() ?? current
    draggedItem.draggable = true

    const dropHandler = (e: DragEvent) => {
      e.preventDefault()
      callDragDropCb(e, dropZone(), ondrop)
    }

    let _target: HTMLElement | undefined
    const dragoverHandler = (e: DragEvent) => {
      e.preventDefault()
      const target = callDragDropCb(e, dropZone(), ondragover)
      if (_target !== target) {
        if (_target) {
          ondragleave?.(e, _target)
        }
        if (target) {
          ondragenter?.(e, target)
        }
      }
      _target = target
    }

    draggedItem.addEventListener('dragstart', (e) => {
      const delDom = delegateDom()
      ondragstart?.(e, draggedItem)
      delDom.addEventListener('drop', dropHandler)
      delDom.addEventListener('dragover', dragoverHandler)
    })
    draggedItem.addEventListener('dragend', (e) => {
      const delDom = delegateDom()
      ondragend?.(e, draggedItem)
      delDom.removeEventListener('drop', dropHandler)
      delDom.removeEventListener('dragover', dragoverHandler)
    })

    draggedItem.addEventListener('drag', (e) => ondrag?.(e, draggedItem))

    const excludes = Array.from(excludeZone?.() ?? [])
    excludes.forEach((exclude) => {
      exclude.addEventListener(
        'mouseenter',
        () => (draggedItem.draggable = false)
      )
      exclude.addEventListener(
        'mouseleave',
        () => (draggedItem.draggable = true)
      )
    })
  }, [])
}

const callDragDropCb = (
  e: DragEvent,
  zone: ZoneUnits,
  cb?: (e: DragEvent, target: HTMLElement) => unknown
) => {
  const path = e.composedPath()
  const target = path.find(
    (v) => v instanceof HTMLElement && Array.from(zone).includes(v)
  )
  target && cb?.(e, target as HTMLElement)
  return target as HTMLElement | undefined
}
