import {
  html,
  repeat,
  useStyle,
  css,
  useEffect,
  Component
} from '@gallop/gallop'
import { WW } from '../../core'
import { AreaDragger } from '../../core/AreaDragger'
import { AreaTrack } from '../../core/AreaTrack'

export const AreaTrackComp: Component = function ({
  areaTrack,
  ww
}: {
  areaTrack: AreaTrack
  ww: WW
}) {
  const dir = areaTrack.direction === 'horizontal' ? 'column' : 'row'

  const generateTemplate = () => {
    return `grid-template-${dir}s : ${areaTrack.grids
      .map((grid) => `${grid}fr`)
      .join(' 5px ')};
     `
  }

  useStyle(
    () => css`
      :host {
        width: 100%;
        height: 100%;
        display: block;
      }

      .area-track-root {
        width: 100%;
        height: 100%;
        display: grid;
        ${generateTemplate()}
      }
    `,
    [areaTrack.direction, areaTrack.grids]
  )

  useEffect(() => {
    areaTrack._dom = this
  }, [])

  return html` <div class="area-track-root">
    ${repeat(
      areaTrack.children,
      (v) => v.id,
      (v) =>
        v instanceof AreaTrack
          ? ww.renderer.renderAreaTrack(v)
          : v instanceof AreaDragger
          ? ww.renderer.renderAreaDragger(v)
          : ww.renderer.renderArea(v)
    )}
  </div>`
}
