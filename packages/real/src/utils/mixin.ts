export function DoAble<
  T extends new (...args: any[]) => object = typeof Object
>(BaseClazz?: T) {
  return class extends (BaseClazz ?? Object) {
    do<F extends (this: this, ...args: any[]) => ReturnType<F>>(
      func: F,
      ...args: Parameters<F>
    ) {
      return func.call(this, ...args)
    }
  }
}
