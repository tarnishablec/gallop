import {
  component,
  html,
  repeat,
  useContext,
  ReactiveElement,
  queryPoolFirst,
  useStyle,
  useState
} from '@gallop/gallop'
import { gloabl, menuContext, menu } from '../../contexts'
import { lang } from '../../language'
import style from '!!to-string-loader!css-loader!sass-loader!./index.scss'

component('side-menu', function (this: ReactiveElement) {
  useContext([menuContext])

  const [state] = useState({ active: menu[0]?.name ?? '' })

  const { locale } = gloabl

  useStyle(() => style, [])

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
            queryPoolFirst('app-main')
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
