import { Looper, useEffect, useHookCount } from '@gallop/gallop'
import { from, fromEvent, Subject, merge, zip } from 'rxjs'
import { tap, switchMap, share, map, mergeMap, mergeAll } from 'rxjs/operators'

type DragDropUnits = HTMLElement[] | NodeListOf<HTMLElement>

export const useDragDrop = ({
  excludeZone,
  dropZone
}: {
  excludeZone?: () => DragDropUnits
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#define_a_drop_zone */
  dropZone: () => DragDropUnits
  ondrop?: (dragged: HTMLElement, target: HTMLElement) => void
  ondragStart?: (targets: DragDropUnits) => void
}) => {
  const current = Looper.resolveCurrentElement()
  const { tagName } = current
  const count = useHookCount()
  const key = { count, tagName }

  useEffect(() => {
    current.draggable = true

    const targets = Array.from(dropZone())
    const _excludes = Array.from(excludeZone?.() ?? [])

    const drag$ = fromEvent(current, 'dragstart').pipe()

    const drops$ = merge(...targets.map((target) => fromEvent(target, 'drop')))

    drops$.subscribe(console.log)
  }, [])
}
