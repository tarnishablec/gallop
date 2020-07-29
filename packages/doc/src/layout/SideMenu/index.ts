import {
  component,
  html,
  repeat,
  useContext,
  ReactiveElement,
  useStyle,
  css
} from '@gallop/gallop'
import { localeContext, localeData, menuData } from '../../contexts'
import { lang } from '@doc/language'
import url from './index.scss?url'

component('side-menu', function (this: ReactiveElement) {
  useContext([localeContext])

  const { menu } = menuData
  const { locale } = localeData

  useStyle(
    () => css`
      @import '${url}';
    `,
    []
  )

  return html`
    <div class="side-menu-wrapper">
      <header>
        <a href="/">Gallop</a>
      </header>
      <div class="menu-list-container">
        <ul
          @click="${(e: Event) => {
            const { target } = e
            if (target instanceof HTMLAnchorElement) {
              const href = target.getAttribute('href') ?? '#none'
              window.location.hash = href.slice()
            }
          }}"
        >
          ${repeat(
            menu,
            (m) => m.name,
            (m) => html`
              <li class="primary-menu">
                <a .href="${`#${m.name}`}">${lang(m.name, locale)}</a>
                ${m.children
                  ? html`<ul>
                      ${repeat(
                        m.children,
                        (n) => n,
                        (n) => html`
                          <li class="child-menu">
                            <a .href="${`#${n}`}">${lang(n, locale)}</a>
                          </li>
                        `
                      )}
                    </ul>`
                  : null}
              </li>
            `
          )}
        </ul>
      </div>
      <svg class="t-svg" width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <clipPath id="side-path" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 h 100 v 100 h -100 z"></path>
          </clipPath>
        </defs>
      </svg>
    </div>
  `
})
