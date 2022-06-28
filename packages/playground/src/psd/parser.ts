import { type Psd, type Layer as PsdLayer } from 'ag-psd'

export { PsdLayer }

export class PsdParser {
  constructor(public psd?: Psd) {}

  useDefiner(definer: typeof PsdLayerDefiner) {}
}

const parser = new PsdParser()

export abstract class PsdLayerDefiner {
  static readonly defineMapping: Readonly<
    Record<string, (layer: PsdLayer) => boolean | void>
  >

  static readonly fallbackType = 'Image'
}

export class BasePsdLayerDefiner extends PsdLayerDefiner {
  static override defineMapping = {
    Image: (layer: PsdLayer) => !!layer.canvas,
    Text: (layer: PsdLayer) => !!layer.text,
    Shape: () => true,
    Group: (layer: PsdLayer) => !!layer.children
  } as const
}

export class RichTextLayerDefiner extends PsdLayerDefiner {
  static override defineMapping = {
    RichText: (layer: PsdLayer) => {}
  } as const
}

parser.useDefiner(BasePsdLayerDefiner)

// export class PsdLayerTransformer {}

// type UnionToIntersectionFn<U> = (
//   U extends unknown ? (k: () => U) => void : never
// ) extends (k: infer I) => void
//   ? I
//   : never

// type GetUnionLast<U> = UnionToIntersectionFn<U> extends () => infer I
//   ? I
//   : never

// type Prepend<Tuple extends unknown[], First> = [First, ...Tuple]

// type UnionToTuple<
//   Union,
//   T extends unknown[] = [],
//   Last = GetUnionLast<Union>
// > = [Union] extends [never]
//   ? T
//   : UnionToTuple<Exclude<Union, Last>, Prepend<T, Last>>
