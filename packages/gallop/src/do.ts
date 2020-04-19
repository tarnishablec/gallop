export abstract class DoAble<T> {
  [key: string]: unknown

  do<F extends (...args: any) => any>(
    this: T,
    func: F,
    ...args: Parameters<F>
  ): ReturnType<F> {
    return func.call(this, ...args)
  }
}
