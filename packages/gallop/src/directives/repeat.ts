import { directive, DirectiveFn, checkIsNodePart } from '../directive'
import { Part } from '../part'
import { Primitive } from '../utils'

type KeyFn<T> = (item: T, index: number) => Primitive
type MapFn<T> = (item: T, index: number) => unknown

export const repeat = directive(function <T>(
  items: Iterable<T>,
  keyOrMapFn: KeyFn<T> | MapFn<T>,
  mapFn?: MapFn<T>
): DirectiveFn {
  let _keyFn: KeyFn<T>
  let _mapFn: MapFn<T>

  if (mapFn === undefined) {
    _mapFn = keyOrMapFn
  } else {
    _keyFn = keyOrMapFn as KeyFn<T>
    _mapFn = mapFn
  }

  return (part: Part) => {
    checkIsNodePart(part)

    const res = new Array()

    let index = 0
    for (const item of items) {
      res.push(_mapFn(item, index))
      index++
    }

    return res
  }
},
false)
