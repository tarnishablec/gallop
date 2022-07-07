import { type UnionToTuple, type Flatten } from '../utils'
import { Definer, type DefinerCheckeFn } from './definer'
import { Transformer } from './transformer'

export class Parser<Layer> extends DoAble() {
  useDefiner<T extends readonly Definer<Layer, any>[]>(...definers: T) {
    return new DefinedParser<Layer, ConcatSupported<Layer, this, T>>(
      this,
      ...definers
    )
  }
}

export class DefinedParser<
  Layer,
  T extends readonly string[]
> extends Parser<Layer> {
  supportedLayerTypes: T
  defines: Record<string, DefinerCheckeFn<Layer>>

  fallback: T[number]

  constructor(
    parser: DefinedParser<Layer, readonly string[]>,
    ...definers: readonly Definer<Layer, any[]>[]
  )
  constructor(
    parser: Parser<Layer>,
    ...definers: readonly Definer<Layer, any[]>[]
  )
  constructor(
    parser: Parser<Layer> | DefinedParser<Layer, readonly string[]>,
    ...definers: readonly Definer<Layer, any[]>[]
  ) {
    super()
    this.defines = {
      ...(parser instanceof DefinedParser ? parser.defines : undefined)
    }
    definers.forEach((definer) => {
      Object.assign(this.defines, definer.defines)
    })
    this.supportedLayerTypes = Object.keys(this.defines) as unknown as T
    this.fallback = this.supportedLayerTypes[0]
  }

  useTransformer<U extends Transformer<Layer, T, any>>(
    transformer: U
  ): PreparedParser<
    Layer,
    T,
    U extends Transformer<Layer, T, Record<T[number], unknown>>
      ? { [K in keyof U['transforms']]: ReturnType<U['transforms'][K]> }
      : never
  > {
    const result = new PreparedParser<
      Layer,
      T,
      U extends Transformer<Layer, T, Record<T[number], unknown>>
        ? { [K in keyof U['transforms']]: ReturnType<U['transforms'][K]> }
        : never
    >(this, transformer)
    transformer.parser = result
    return result
  }
}

export class PreparedParser<
  Layer,
  T extends readonly string[],
  Result extends Record<T[number], unknown> = Record<T[number], unknown>
> extends DefinedParser<Layer, T> {
  transforms: Record<string, (layer: Layer) => unknown>
  constructor(
    definedParser: DefinedParser<Layer, T>,
    transformer: Transformer<Layer, T>
  ) {
    super(definedParser)
    this.transforms = {
      ...transformer.transforms
    }
  }

  parseLayer(layer: Layer) {
    return this.transforms[this.resolveLayerType(layer)](
      layer
    ) as Result[T[number]]
  }

  protected resolveLayerType(layer: Layer): T[number] {
    const resolveLayerByChecker = (
      checkerType: T[number]
    ): T[number] | undefined => {
      const checker = this.defines[checkerType]
      const checkResult = checker(layer)
      if (checkResult === true) {
        return checkerType
      } else if (typeof checkResult === 'string') {
        return resolveLayerByChecker(checkResult)
      }
    }

    // let defineResult: T[number]

    for (const type in this.defines) {
      const defineResult = resolveLayerByChecker(type)
      if (defineResult) {
        return defineResult
      }
    }

    return this.fallback
  }
}

type ConcatSupported<Layer, P extends Parser<Layer>, T> = CheckStringArr<
  UnionToTuple<
    [
      ...(P extends DefinedParser<Layer, readonly string[]>
        ? P['supportedLayerTypes']
        : []),
      ...Flatten<{
        [K in keyof T]: T[K] extends Definer<Layer, infer U> ? U : never
      }>
    ][number]
  >
>

type CheckStringArr<T> = T extends readonly string[] ? T : never

export function DoAble<T extends new (...args: any[]) => object>(
  BaseClazz?: T
) {
  return class extends (BaseClazz ?? Object) {
    do<F extends (...args: any[]) => ReturnType<F>>(
      func: F,
      ...args: Parameters<F>
    ) {
      return func.call(this, ...args)
    }
  }
}
