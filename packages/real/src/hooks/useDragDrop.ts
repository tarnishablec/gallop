import { Looper, useEffect } from '@gallop/gallop'
import { from, fromEvent, Subject, merge, zip, defer } from 'rxjs'
import {
  tap,
  switchMap,
  share,
  map,
  mergeMap,
  mergeAll,
  takeUntil,
  throttleTime
} from 'rxjs/operators'

export type ZoneUnits = HTMLElement[] | NodeListOf<HTMLElement>

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

    const targets = Array.from(dropZone())

    const dragstart$ = fromEvent(current, 'dragstart').pipe(
      tap(() => {}),
      share()
    )

    dragstart$.subscribe(console.log)
  }, [])
}

const highlightDropTarget = (target: HTMLElement) => {
  // TODO
}
