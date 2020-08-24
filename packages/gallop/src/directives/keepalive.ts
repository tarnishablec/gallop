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

  const oldPatcher = part.value
  const { cache, now } = alivePart

  const nodes = part.clear()

  if (now && oldPatcher instanceof Patcher) {
    oldPatcher.dof = nodes
  }


  if (view instanceof HTMLClip) {
    const key = Reflect.get(view, __key__) as Key | undefined

    if (key) {
      const p = cache.get(key)
      alivePart.now = key
      if (p) {
        p.patch(view.do(getVals))
        const { endNode } = part.location
        const parentNode = endNode.parentNode!
        p.appendTo(parentNode, endNode)
        part.value = p
        return
      } else {
        const patcher = part.setValue(view)
        cache.set(key, patcher)
        return
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
