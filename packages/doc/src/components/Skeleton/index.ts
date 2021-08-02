import { html, component, useStyle, css, repeat } from '@gallop/gallop'
import raw from './index.scss?inline'

component(
  'skele-ton',
  ({
    active = true,
    avatar = false,
    title = true,
    line = 4,
    color
  }: {
    active?: boolean
    title?: boolean
    avatar?: boolean
    color?: string
    line?: number
  } = {}) => {
    useStyle(
      () => css`
        ${raw}
        :host {
          --skeleton-color: ${color ?? 'rgb(242,242,242)'};
        }

        .skeleton {
          display: grid;
          grid-template-columns: ${avatar ? 'auto' : ''} 1fr;
        }

        .skeleton-title,
        .skeleton-avatar,
        .skeleton-paragraph > li {
          background-size: 400% 100%;
          ${active
            ? `background-image: linear-gradient(
            90deg,
            var(--skeleton-color) 25%,
            rgb(230, 230, 230) 37%,
            var(--skeleton-color) 63%
          )`
            : `background: var(--skeleton-color)`};
          ${active ? `animation: loading 1.4s ease infinite;` : ''}
        }
      `,
      [avatar, active, color]
    )

    return html`
      <div class="skeleton">
        ${avatar ? SkeletonAvatar() : null}
        <div>
          ${title ? SkeletonTitle() : null} ${SkeletonParagraph({ line })}
        </div>
      </div>
    `
  }
)

const SkeletonAvatar = () => html` <span class="skeleton-avatar"></span> `

const SkeletonTitle = () =>
  html` <h3 class="skeleton-title" style="width: 38%"></h3> `

const SkeletonParagraph = ({ line = 4 }: { line?: number } = {}) =>
  html`<ul class="skeleton-paragraph">
    ${repeat(
      new Array(line).fill(void 0),
      (_, index) => index,
      (_, index) =>
        index + 1 === line
          ? html`<li style="width: 61%"></li>`
          : html`<li></li>`
    )}
  </ul>`
