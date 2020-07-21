import { html, component, useStyle, css, repeat } from '@gallop/gallop'

component(
  'skele-ton',
  ({
    active = true,
    avatar = false,
    line = 4,
    color
  }: {
    active?: boolean
    avatar?: boolean
    color?: string
    line?: number
  } = {}) => {
    useStyle(
      () => css`
        :host {
          --skeleton-color: ${color || 'rgb(242,242,242)'};
        }

        @keyframes loading {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0 50%;
          }
        }

        .skeleton {
          /* padding: 1rem; */
          display: grid;
          grid-template-columns: ${avatar ? 'auto' : ''} 1fr;
        }

        .skeleton-avatar {
          border-radius: 50%;
          height: 40px;
          line-height: 40px;
          width: 40px;
          margin: 0.5rem 1rem 0 0;
        }

        .skeleton-title {
          height: 1.2rem;
        }

        .skeleton-paragraph {
          padding: 0;
          display: grid;
          row-gap: 1rem;
        }

        .skeleton-paragraph > li {
          list-style: none;
          height: 1rem;
          width: 100%;
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
      [avatar, active]
    )

    return html`
      <div class="skeleton">
        ${avatar ? SkeletonAvatar() : null}
        <div>
          ${SkeletonTitle()} ${SkeletonParagraph({ line })}
        </div>
      </div>
    `
  }
)

const SkeletonAvatar = () => html` <span class="skeleton-avatar"></span> `

const SkeletonTitle = () =>
  html` <h3 class="skeleton-title" style="width: 38%"></h3> `

const SkeletonParagraph = ({ line = 4 }: { line?: number }) =>
  html`<ul class="skeleton-paragraph">
    ${repeat(
      new Array(line).fill(1),
      (_, index) => index,
      (_, index) =>
        html`${index + 1 === line
          ? html`<li style="width: 61%"></li>`
          : html`<li></li>`}`
    )}
  </ul>`
