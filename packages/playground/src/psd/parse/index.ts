import { Parser, Definer, Transformer, PreparedParser } from '@gallop/parsever'

import { type Layer as PsdLayer } from 'ag-psd'

export class BasePsdLayerDefiner extends Definer<
  PsdLayer,
  readonly ['Image', 'Text', 'Shape', 'Group']
> {
  defines = {
    Image: (layer: PsdLayer) => !!layer.canvas,
    Text: (layer: PsdLayer) => {
      if (layer.text) {
        const { styleRuns } = layer.text
        if (styleRuns) {
          if (
            styleRuns.length > 2 ||
            styleRuns.some((run) =>
              Object.keys(run).some((key) => key !== 'autoKerning')
            )
          ) {
            return 'Image'
          }
        }
        return true
      }
    },
    Shape: () => 'Image',
    Group: (layer: PsdLayer) => !!layer.children
  } as const
}

export class RichTextLayerDefiner extends Definer<
  PsdLayer,
  readonly ['RichText']
> {
  defines = {
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

class RexTransformer extends Transformer<
  PsdLayer,
  ['Image', 'Text', 'Shape', 'Group']
> {
  transforms = {
    Image: () => {
      return { type: 'Image' } as const
    },
    Text: () => {
      return { type: 'Text' } as const
    },
    Shape: () => {
      return { type: 'Shape' } as const
    },
    Group: (
      layer: PsdLayer,
      parser?: PreparedParser<PsdLayer, ['Image', 'Text', 'Shape', 'Group']>
    ) => {
      return {
        type: 'Group',
        children: layer.children?.map((child) => {})
      } as const
    }
  }
}

const deformer = new Parser<PsdLayer>()

const defined = deformer.useDefiner(new BasePsdLayerDefiner())

const prepared = defined.useTransformer(new RexTransformer())

const defined2 = defined.useDefiner(new RichTextLayerDefiner())

// const prepared2 = defined2.useTransformer(new RexTransformer())

console.log(Object.is(defined2, deformer))
// console.log(def2 === deformer)
console.log(defined2.defines)

// type A = typeof d[number]

export abstract class PsdLayerTransformer {
  static readonly transformMapping: Readonly<
    Record<string, (layer: PsdLayer) => unknown>
  >
}
