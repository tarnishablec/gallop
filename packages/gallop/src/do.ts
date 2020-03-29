export abstract class DoAble<T> {
  do<F extends Function>(this: T, func: F, ...args: ParamsOf<F>): ReturnOf<F> {
    return func.call(this, ...args)
  }
}

type ParamsOf<T extends Function> = T extends (...args: infer P) => unknown
  ? P
  : never

type ReturnOf<T extends Function> = T extends (...args: ParamsOf<T>) => infer R
  ? R
  : never
