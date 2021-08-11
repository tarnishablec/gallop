import {
  component,
  html,
  repeat,
  useContext,
  ReactiveElement,
  useStyle
} from '@gallop/gallop'
import { localeContext, menuData, localeData } from '../../contexts'
import raw from './index.scss?inline'
import { localize } from '../../language'

component('side-menu', function (this: ReactiveElement) {
  useContext([localeContext])

  useStyle(() => raw, [])

  const { menu } = menuData
  const { locale } = localeData

  useStyle(() => raw, [])

  return html`
    <div class="side-menu-wrapper">
      <header>
        <a href="/">Gallop</a>
      </header>
      <div class="menu-list-container">
        <ul
          @click="${(e: Event) => {
            const { target } = e
            if (target instanceof HTMLAnchorElement)
              window.location.hash = (
                target.getAttribute('href') ?? '#none'
              ).slice()
          }}"
        >
          ${repeat(
            menu,
            (m) => m.name,
            (m) => html`
              <li class="primary-menu">
                <a .href="${`#${m.name}`}">${m.name}</a>
                ${m.children
                  ? html`<ul>
                      ${repeat(
                        m.children,
                        (n) => n,
                        (n) => html`
                          <li class="child-menu">
                            <a .href="${`#${n}`}">${localize(n, locale)}</a>
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
    </div>
  `
})
