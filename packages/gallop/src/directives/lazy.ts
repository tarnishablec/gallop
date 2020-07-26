import { directive, ensurePartType } from '../directive'
import { NodePart } from '../part'
import { suspense, SuspenseOption } from './suspense'

const anchorCbMap = new WeakMap<Element, () => unknown>()

const interObs = new IntersectionObserver((entries) =>
  entries.forEach((entry) => anchorCbMap.get(entry.target)?.())
)

const __loaded__ = Symbol('__loaded__')

export const lazy = directive(function (
  wish: () => unknown,
  {
    pending,
    fallback,
    delay,
    minHeight = 0
  }: Omit<SuspenseOption, 'once'> & { minHeight?: number | string } = {}
) {
  return (part) => {
    if (!ensurePartType(part, NodePart)) return

    if (Reflect.get(part, __loaded__)) {
      part.setValue(wish())
      return
    }

    const { endNode } = part.location
    const div = document.createElement('div')
    div.style.minHeight = String(minHeight)
    endNode.parentNode!.insertBefore(div, endNode)

    anchorCbMap.set(div, () => {
      Reflect.set(part, __loaded__, true)
      interObs.unobserve(div)
      part.clear()
      part.setValue(
        suspense(() => new Promise((resolve) => resolve(wish())), {
          pending,
          fallback,
          delay
        })
      )
    })
    interObs.observe(div)
  }
})
