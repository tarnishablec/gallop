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
if (deformer.useDefiner(new BasePsdLayerDefiner())) {
  const a = deformer.getSupportedLayerTypes()
  console.log(a)

  if (deformer.useDefiner(new RichTextLayerDefiner())) {
    const b = deformer.getSupportedLayerTypes()
    console.log(b)
  }
}

export abstract class PsdLayerTransformer {
  static readonly transformMapping: Readonly<
    Record<string, (layer: PsdLayer) => unknown>
  >
}
