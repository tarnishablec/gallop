import { html, useStyle, css } from '@gallop/gallop'
import { Direction } from '@real/utils/type'

export function AreaTrack({
  direction,
  grids
}: {
  direction: Direction
  grids: string[]
}) {
  const gridDirection = direction === 'horizontal' ? 'columns' : 'rows'
  const gridTemplates = `grid-template-${gridDirection}: ${grids.join(' ')}`
  useStyle(
    () => css`
      :root > div {
        display: grid;
        ${gridTemplates};
      }
    `,
    [gridTemplates]
  )
  return html` <div>
    <slot></slot>
  </div>`
}
