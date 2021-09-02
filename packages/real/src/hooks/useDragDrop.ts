import { Looper, useEffect } from '@gallop/gallop'

export type ZoneUnits = HTMLElement[] | NodeListOf<HTMLElement>

/** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#define_a_drop_zone */
export const useDragDrop = ({
  excludeZone,
  dropZone,
  ondrop,
  ondragstart,
  ondragend,
  ondragover,
  ondrag,
  ondragenter,
  delegateDom = () => document.body
}: {
  excludeZone?: () => ZoneUnits
  dropZone: () => ZoneUnits
  ondrop?: (e: DragEvent, target: HTMLElement) => unknown
  ondragstart?: (e: DragEvent) => unknown
  ondragend?: (e: DragEvent) => unknown
  ondrag?: (e: DragEvent) => unknown
  ondragover?: (e: DragEvent, target: HTMLElement) => unknown
  ondragenter?: (e: DragEvent, target: HTMLElement) => unknown
  delegateDom?: () => HTMLElement
}) => {
  const current = Looper.resolveCurrentElement()

  useEffect(() => {
    current.draggable = true

    const dropHandler = (e: DragEvent) => {
      e.preventDefault()
      callDragDropCb(e, dropZone(), ondrop)
    }

    const dragoverHandler = (e: DragEvent) => {
      e.preventDefault()
      callDragDropCb(e, dropZone(), ondragover)
    }

    const dragenterHandler = (e: DragEvent) => {
      e.preventDefault()
      callDragDropCb(e, dropZone(), ondragenter)
    }

    current.addEventListener('dragstart', (e) => {
      const delDom = delegateDom()
      ondragstart?.(e)
      delDom.addEventListener('drop', dropHandler)
      delDom.addEventListener('dragover', dragoverHandler)
      ondragenter && delDom.addEventListener('dragenter', dragenterHandler)
    })
    current.addEventListener('dragend', (e) => {
      const delDom = delegateDom()
      ondragend?.(e)
      delDom.removeEventListener('drop', dropHandler)
      delDom.removeEventListener('dragover', dragoverHandler)
      ondragenter && delDom.removeEventListener('dragenter', dragenterHandler)
    })

    current.addEventListener('drag', (e) => ondrag?.(e))

    const excludes = Array.from(excludeZone?.() ?? [])
    excludes.forEach((exclude) => {
      exclude.addEventListener('mouseenter', () => (current.draggable = false))
      exclude.addEventListener('mouseleave', () => (current.draggable = true))
    })
  }, [])
}

const callDragDropCb = (
  e: DragEvent,
  zone: ZoneUnits,
  cb?: (e: DragEvent, target: HTMLElement) => unknown
) => {
  const [dropPoint] = e.composedPath()
  if (dropPoint instanceof HTMLElement)
    Array.from(zone).includes(dropPoint) && cb?.(e, dropPoint)
}
