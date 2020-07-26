import {
  component,
  html,
  repeat,
  useContext,
  ReactiveElement,
  useStyle,
  css
} from '@gallop/gallop'
import { localeContext, localeData, menuContext, menuData } from '../../contexts'
import { lang } from '../../language'
import url from './index.scss?url'

component('side-menu', function (this: ReactiveElement) {
  useContext([menuContext, localeContext])

  const { menu, current } = menuData

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
          if (target instanceof HTMLAnchorElement) {
            const href = target.getAttribute('href')
            if (href) menuData.current = href.slice(1)
          }
        }}"
      >
        ${repeat(
          menu,
          (m) => m.name,
          (m) => html`
            <li class="primary-menu">
              <a
                .href="${`#${m.name}`}"
                .class="${current === m.name ? 'active' : ''}"
                >${lang(m.name, locale)}</a
              >
              ${m.children
                ? html`<ul>
                    ${repeat(
                      m.children,
                      (n) => n,
                      (n) => html`
                        <li class="child-menu">
                          <a
                            .href="${`#${n}`}"
                            .class="${current === n ? 'active' : ''}"
                            >${lang(n, locale)}</a
                          >
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
