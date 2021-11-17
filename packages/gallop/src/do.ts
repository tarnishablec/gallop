export function DoAble<T extends new (...args: any[]) => object>(BaseClazz: T) {
  return class extends BaseClazz {
    do<F extends (...args: any[]) => ReturnType<F>>(
      func: F,
      ...args: Parameters<F>
    ) {
      return func.call(this, ...args)
    }
  }
}
