import { html, useStyle, css, useEffect, type Component } from '@gallop/gallop'
// import { repeat } from '@gallop/gallop/directives'
import { WW } from '../../core'
import { AreaDragger } from '../../core/AreaDragger'
import { AreaTrack } from '../../core/AreaTrack'
import { sharedRepeat } from '../../gallop/sharedRepeat'
import { FR_UNIT } from '../../utils/const'

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
      .join(` ${FR_UNIT}px `)};
     `
  }

  useStyle(
    () => css`
      :host {
        width: 100%;
        height: 100%;
        display: block;
        overflow: hidden;
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
    const { parent } = areaTrack

    if (parent) {
      const index = parent.children.indexOf(areaTrack)
      parent.grids[index] =
        (parent.direction === 'horizontal'
          ? this.clientWidth
          : this.clientHeight) / FR_UNIT
    }
  }, [])

  return html` <div class="area-track-root">
    ${sharedRepeat(
      areaTrack.children
        .flatMap((v, index) => [v, areaTrack.draggers[index]])
        .filter(Boolean),
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
