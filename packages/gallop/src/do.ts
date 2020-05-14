type Clazz<T = {}> = {
  new (...args: any[]): T
}

export function DoAble<T extends Clazz>(BaseClazz: T) {
  return class extends BaseClazz {
    [key: string]: unknown

    do<F extends (...args: any) => any>(
      func: F,
      ...args: Parameters<F>
    ): ReturnType<F> {
      return func.call(this, ...args)
    }
  }
}
