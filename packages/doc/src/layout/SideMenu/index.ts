import {
  component,
  html,
  repeat,
  useContext,
  ReactiveElement,
  queryShadow,
  useStyle,
  useState,
  css
} from '@gallop/gallop'
import { localeContext, localeData, menuContext, menu } from '../../contexts'
import { lang } from '../../language'
import url from './index.scss?url'

component('side-menu', function (this: ReactiveElement) {
  useContext([menuContext, localeContext])

  const [state] = useState({ active: menu[0]?.name ?? '' })

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
            href && (state.active = href.slice(1))
            queryShadow('app-main')
              ?.$root.querySelector(href ?? '#')
              ?.scrollIntoView({ behavior: 'smooth' })
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
                .class="${state.active === m.name ? 'active' : ''}"
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
                            .class="${state.active === n ? 'active' : ''}"
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
