import {
  component,
  html,
  repeat,
  useContext,
  ReactiveElement,
  useStyle
} from '@gallop/gallop'
import { localeContext, localeData, menuData } from '../../contexts'
import { lang } from '@doc/language'
import raw from './index.scss?raw'

component('side-menu', function (this: ReactiveElement) {
  useContext([localeContext])

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
    </div>
  `
})
