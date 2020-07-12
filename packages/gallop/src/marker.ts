export const markerIndex = 'π'
export const marker = `<!--${markerIndex}-->`

export const isMarker = (target: Node): target is Comment =>
  target.constructor === Comment && (target as Comment).data === markerIndex
