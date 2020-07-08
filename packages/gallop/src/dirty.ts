export class Recycler {
  protected static dirtyCollectionSet = new WeakSet()

  static markDirty = (target: object) => Recycler.dirtyCollectionSet.add(target)

  static checkDirty = (target: object) => Recycler.dirtyCollectionSet.has(target)

  static resetDirtyCollectionSet = () =>
    (Recycler.dirtyCollectionSet = new WeakSet())
}
