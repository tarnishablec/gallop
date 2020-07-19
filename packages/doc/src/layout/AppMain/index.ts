import { component, html, repeat, useContext, useStyle, css } from '@gallop/gallop'
import { menu, context } from '../SideMenu'
import { gloabl } from '../../contexts'
import { lang } from '../../language'

component('app-main', () => {
  useContext([context])

  const { locale } = gloabl

  useStyle(
    () => css`
      :host {
        height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      nav {
        height: 3.6rem;
        font-size: 1.1rem;
        background: white;
        box-shadow: 0 2px 2px -2px gray;
        display: grid;
        place-items: center end;
        justify-content: end;
        grid-template-columns: repeat(4, auto);
        padding: 0 3rem;
        column-gap: 0.5rem;
      }

      nav a {
        text-decoration: none;
        color: grey;
      }

      .app-main-content {
        overflow-y: auto;
        width: 100%;
        max-width: 900px;
        padding: 0 1rem 0 2rem;
        margin: 0 auto;
        box-sizing: border-box;
      }

      .app-main-content hr {
        border: 1px solid rgba(239, 51, 53, 0.4);
      }

      h2,
      h3 {
        position: relative;
        cursor: pointer;
      }

      h2:hover::before,
      h3:hover::before {
        visibility: unset;
      }

      h2::before,
      h3::before {
        content: url(https://rollupjs.org/images/anchor.svg);
        display: block;
        position: absolute;
        left: -25px;
        visibility: hidden;
      }
    `,
    []
  )

  return html` <nav>
      <a style="color: black"><strong>guide</strong></a>
      <a href="https://gitter.im/gallopweb/community">/ chat</a>
    </nav>
    <div class="app-main-content">
      ${repeat(
        menu,
        (m) => m.name,
        (m) => html`
          <h2 .id="${m.name}">${lang(m.name, locale)}</h2>
          <hr />
          ${repeat(
            m.children,
            (c) => c,
            (c) =>
              html`<h3 .id="${c}">${lang(c, locale)}</h3>
                <mark-down
                  :locale="${locale}"
                  :filename="${c.toLowerCase() + '.md'}"
                ></mark-down> `
          )}
        `
      )}
    </div>`
})
