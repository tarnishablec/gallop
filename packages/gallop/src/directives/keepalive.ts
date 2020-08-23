import { directive, ensurePartType } from '../directive'
import { Key, forceGet } from '../utils'
import { html } from '../parse'
import { HTMLClip, getVals } from '../clip'
import { NodePart } from '../part'
import { Patcher } from '../patcher'

const __key__ = Symbol('key')

const alivePartMap = new WeakMap<NodePart, AlivePart>()

class AlivePart extends NodePart {
  now?: Key
  cache: Map<Key, Patcher> = new Map()
}

export const keep = directive((view: unknown) => (part) => {
  if (!ensurePartType(part, NodePart)) return

  const alivePart = forceGet(
    alivePartMap,
    part,
    () => new AlivePart(part.location)
  )

  if (view instanceof HTMLClip) {
    const key = Reflect.get(view, __key__) as Key | undefined
    if (key) {
      const { now, cache } = alivePart
      if (now === key) {
        part.setValue(view)
        return
      } else {
        const patcher = cache.get(key)
        if (!patcher) {
          cache.set(key, part.setValue(view))
        } else {
          const vals = view.do(getVals)
          // TODO
        }
      }
    }
  }
  alivePart.now = undefined
  part.setValue(view)
})

export const alive = (key: Key) => (
  strs: TemplateStringsArray,
  ...vals: unknown[]
) => {
  const clip = html(strs, ...vals)
  Reflect.set(clip, __key__, key)
  return clip
}
