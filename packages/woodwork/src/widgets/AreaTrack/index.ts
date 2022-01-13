import { html, repeat, useStyle, css } from '@gallop/gallop'
import { WW } from '../../core'
import { AreaTrack } from '../../core/AreaTrack'

export const AreaTrackComp = ({
  areaTrack,
  ww
}: {
  areaTrack: AreaTrack
  ww: WW
}) => {
  const generateTemplate = () => {
    return `grid-template-${areaTrack.direction}s : ${areaTrack.grids
      .map((grid) => `${grid}fr`)
      .join(' ')};
      ${areaTrack.direction}-gap : 5px;`
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

  return html` <div class="area-track-root">
    ${repeat(
      areaTrack.children,
      (v) => v.id,
      (v) =>
        v instanceof AreaTrack
          ? ww.renderer.renderAreaTrack(v)
          : ww.renderer.renderArea(v)
    )}
  </div>`
}
