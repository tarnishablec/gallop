import {
  directive,
  ensurePartType,
  html,
  HTMLClip,
  Patcher,
  NodePart,
  getVals,
  Key,
  forceGet
} from '@gallop/gallop'

const __key__ = Symbol('alive')

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

  let key: Key | undefined

  if (view instanceof HTMLClip) key = Reflect.get(view, __key__)

  if (key === now) return part.setValue(view)

  if (now && oldPatcher instanceof Patcher) {
    oldPatcher.dof = part.clear()
    cache.set(now, oldPatcher)
  }

  alivePart.now = key

  if (key !== void 0) {
    const patcher = cache.get(key)
    const { endNode } = part.location
    if (patcher) {
      patcher.patch((view as HTMLClip).do(getVals))
      patcher.appendTo(endNode.parentNode!, endNode)
      part.value = patcher
    } else {
      cache.set(key, part.setValue(view as HTMLClip))
    }
  } else {
    part.setValue(view)
  }
})

export const alive =
  (key: Key) =>
  (strs: TemplateStringsArray, ...vals: unknown[]) => {
    const clip = html(strs, ...vals)
    Reflect.set(clip, __key__, key)
    return clip
  }

export function setAlive(this: HTMLClip, key: Key) {
  Reflect.set(this, __key__, key)
  return this
}
