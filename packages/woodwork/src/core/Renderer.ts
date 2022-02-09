import { WW } from '.'
import { registerGallopElement } from '../gallop'
import { AreaComp } from '../widgets/Area'
import { AreaTrackComp } from '../widgets/AreaTrack'
import { dynamic } from '@gallop/gallop/directives'
import { HTMLClip, html, render, isReactive } from '@gallop/gallop'
import { AreaTrack } from './AreaTrack'
import { Area } from './Area'
import { AreaDragger } from './AreaDragger'
import { AreaDraggerComp } from '../widgets/AreaDragger'
export interface IWWRenderer {
  ww: WW
  renderAreaDragger(areaDragger: AreaDragger): unknown
  renderArea(area: Area): unknown
  renderAreaTrack(areaTrack: AreaTrack): unknown
  mount(options: {
    rootTrack: AreaTrack
    container: Node
    before?: Node | null
  }): {
    unmount: () => unknown
  }

  reflowAreaTrack({
    areaTrack,
    grids
  }: {
    areaTrack: AreaTrack
    grids?: number[]
  }): unknown
}

@registerGallopElement(WWRenderer.areaTag, AreaComp)
@registerGallopElement(WWRenderer.areaTrackTag, AreaTrackComp)
@registerGallopElement(WWRenderer.areaDraggerTag, AreaDraggerComp)
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
  static areaDraggerTag = 'ww-area-dragger'
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

  renderAreaDragger(areaDragger: AreaDragger): HTMLClip {
    return html`${dynamic({
      name: WWRenderer.areaDraggerTag,
      props: {
        ww: this.ww,
        areaDragger
      }
    })}`
  }

  reflowAreaTrack({
    areaTrack,
    grids
  }: {
    areaTrack: AreaTrack
    grids?: number[]
  }): void {
    const { _dom } = areaTrack

    if (grids) {
      areaTrack.grids = [...grids]
    }
    if (isReactive(_dom)) {
      _dom.requestUpdate()
    }
  }
}
