import { WW } from '.'
import { registerGallopElement } from '../gallop'
import { AreaComp } from '../widgets/Area'
import { AreaTrackComp } from '../widgets/AreaTrack'
import { HTMLClip, dynamic, html, render } from '@gallop/gallop'
import { AreaTrack } from './AreaTrack'
import { Area } from './Area'

export interface IWWRenderer {
  ww: WW
  renderArea(area: Area): unknown
  renderAreaTrack(areaTrack: AreaTrack): unknown
  mount(options: {
    rootTrack: AreaTrack
    container: Node
    before?: Node | null
  }): {
    unmount: () => unknown
  }
}

@registerGallopElement(WWRenderer.areaTag, AreaComp)
@registerGallopElement(WWRenderer.areaTrackTag, AreaTrackComp)
export class WWRenderer implements IWWRenderer {
  constructor(public ww: WW) {}

  mount({
    rootTrack,
    container,
    before = container.firstChild
  }: {
    rootTrack: AreaTrack
    container: Node
    before?: Node | null
  }): { unmount: () => unknown } {
    const clip = this.renderAreaTrack(rootTrack)
    const { destroy } = render(clip, { container, before })
    return { unmount: destroy }
  }

  static areaTag = 'ww-area'
  static areaTrackTag = 'ww-area-track'

  renderAreaTrack(areaTrack: AreaTrack): HTMLClip {
    return html`
      ${dynamic({
        name: WWRenderer.areaTrackTag,
        props: {
          ww: this.ww,
          areaTrack
        }
      })}
    `
  }
  renderArea(area: Area): HTMLClip {
    return html` ${dynamic({
      name: WWRenderer.areaTag,
      props: {
        ww: this.ww,
        area
      }
    })}`
  }
}
