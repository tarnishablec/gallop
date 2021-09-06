import { isObject } from './utils'
import { Looper } from './loop'

export class Recycler {
  protected static dirtyCollectionSet = new WeakSet()

  static markDirty = (target: object) => Recycler.dirtyCollectionSet.add(target)

  static checkDirty = (target: object) =>
    Recycler.dirtyCollectionSet.has(target)

  static resetDirtyCollectionSet = () =>
    (Recycler.dirtyCollectionSet = new WeakSet())

  static compareDepends = (oldDeps?: unknown[], newDeps?: unknown[]) => {
    let dirty = false
    if (!oldDeps || !newDeps) {
      dirty = true
    } else {
      for (let i = 0; i < newDeps.length; i++) {
        const dep = newDeps[i]
        if (
          (isObject(dep) &&
            (!Object.is(dep, oldDeps[i]) || Recycler.checkDirty(dep))) ||
          !Object.is(dep, oldDeps[i])
        ) {
          dirty = true
          break
        }
      }
    }
    return dirty
  }
}

// Loop end
Looper.setLoopEndCallBack(
  'resetDirtyCollectionSet',
  Recycler.resetDirtyCollectionSet,
  0
)
