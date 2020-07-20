import { directive, ensurePartType } from '../directive'
import { NodePart } from '../part'
import { suspense, SuspenseOption } from './suspense'

const anchorCbMap = new WeakMap<Element, () => unknown>()

const interObs = new IntersectionObserver((entries) =>
  entries.forEach((entry) => anchorCbMap.get(entry.target)?.())
)

const loaded = Symbol('loaded')

export const lazy = directive(function <T>(
  wish: () => Promise<T>,
  options: Omit<SuspenseOption, 'once'> = {}
) {
  return (part) => {
    if (!ensurePartType(part, NodePart)) return

    if (Reflect.get(part, loaded)) {
      part.setValue(wish())
      return
    }

    const { endNode } = part.location
    const span = document.createElement('span')
    endNode.parentNode!.insertBefore(span, endNode)
    interObs.observe(span)

    anchorCbMap.set(span, () => {
      Reflect.set(part, loaded, true)
      interObs.unobserve(span)
      part.clear()
      part.setValue(
        suspense(
          () =>
            new Promise((resolve) => {
              resolve(wish())
            }),
          options
        )
      )
    })
  }
})
