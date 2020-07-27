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
    <header>
      <a href="/">Gallop</a>
    </header>
    <div class="menu-list-container">
      <ul
        @click="${(e: Event) => {
          const { target } = e
          if (target instanceof HTMLAnchorElement)
            (this.nextElementSibling as ReactiveElement).$root
              .querySelector(target.getAttribute('href') ?? '#none')
              ?.scrollIntoView({ behavior: 'smooth' })
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
  `
})
