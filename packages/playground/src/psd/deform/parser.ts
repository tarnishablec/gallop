import {
  type PsdLayer,
  PsdDeformer,
  PsdLayerDefiner,
  BasePsdLayerDefiner
} from '@gallop/psd-deformer'

export class RichTextLayerDefiner extends PsdLayerDefiner<
  readonly ['RichText']
> {
  defineMapping = {
    RichText: (layer: PsdLayer) => {
      return !!(
        layer.text &&
        layer.text.styleRuns &&
        (layer.text.styleRuns.length > 2 ||
          layer.text.styleRuns.some((run) =>
            Object.keys(run).some((key) => key !== 'autoKerning')
          ))
      )
    }
  } as const
}

const deformer = new PsdDeformer()
const deformer2 = new PsdDeformer()

const def = deformer.useDefiner(new BasePsdLayerDefiner())

const a = def.supportedLayerTypes
console.log(a)

const def2 = def.useDefiner(new RichTextLayerDefiner())
console.log(Object.is(def2, deformer))
console.log(def2.definersMap)

const b = def.supportedLayerTypes
console.log(b)

const c = deformer2.supportedLayerTypes
console.log(c)

const def3 = def2.useDefiner(new BasePsdLayerDefiner())
const d = def3.supportedLayerTypes
console.log(def3.supportedLayerTypes)
console.log(d)

type A = typeof d[number]

export abstract class PsdLayerTransformer {
  static readonly transformMapping: Readonly<
    Record<string, (layer: PsdLayer) => unknown>
  >
}
