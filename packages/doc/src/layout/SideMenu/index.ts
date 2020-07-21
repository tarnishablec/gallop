import {
  component,
  html,
  repeat,
  createContext,
  useContext,
  ReactiveElement,
  queryPoolFirst,
  useStyle,
  css,
  useState
} from '@gallop/gallop'
import { gloabl, menuContext, menu } from '../../contexts'
import { lang } from '../../language'

component('side-menu', function (this: ReactiveElement) {
  useContext([menuContext])

  const [state] = useState({ active: menu[0]?.name ?? '' })

  const { locale } = gloabl

  useStyle(
    () => css`
      :host {
        background: rgba(0, 0, 0, 0.2);
        display: grid;
        grid-auto-rows: min-content 1fr;
        box-shadow: 0 0 3px 1px gray;
        z-index: 5;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      header {
        line-height: 3rem;
        text-align: center;
        font-family: 'Caveat', cursive;
        font-size: 2rem;
        user-select: none;
      }

      .menu-list-container {
        padding: 0.5rem 1rem;
      }

      .menu-list-container ul {
        padding-left: 1rem;
        list-style-type: none;
        margin: 0;
      }

      li {
        margin: 0.3rem 0;
      }

      li.primary-menu::before {
        content: '»';
        position: absolute;
        left: 1rem;
        color: rgba(0, 0, 0, 0.5);
      }

      li.primary-menu > a {
        font-size: 1.1rem;
        color: #333;
      }

      li.child-menu > a {
        color: #666;
      }

      .menu-list-container a.active::before,
      .menu-list-container a:hover::before {
        content: '';
        display: inline-block;
        height: 1.5rem;
        width: 2px;
        vertical-align: middle;
        position: absolute;
        line-height: normal;
        left: 0;
      }

      .menu-list-container a:hover::before {
        background: var(--active-color);
        opacity: 0.4;
      }

      .menu-list-container a.active::before {
        background: var(--active-color);
        opacity: 1;
      }

      header span {
        cursor: pointer;
      }
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
