import { PsdLayerDefiner } from '../core/definer'
import { type PsdLayer } from '../types'

export class BasePsdLayerDefiner extends PsdLayerDefiner<
  readonly ['Image', 'Text', 'Shape', 'Group']
> {
  defineMapping = {
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
  }
}
