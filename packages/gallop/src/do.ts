// eslint-disable-next-line @typescript-eslint/ban-types
export function DoAble<T extends { new (...args: any[]): object }>(
  BaseClazz: T
) {
  return class extends BaseClazz {
    do<F extends (...args: any[]) => unknown>(func: F, ...args: Parameters<F>) {
      return func.call(this, ...args) as ReturnType<F>
    }
  }
}
