import { component, html, repeat, useContext } from '@gallop/gallop'
import { menu, context } from '../SideMenu'
import { gloabl } from '../../contexts'

component('app-main', () => {
  useContext([context])

  return html` <nav>
      <a style="color: black"><strong>guide</strong></a>
      <a href="https://gitter.im/gallopweb/community">/ chat</a>
    </nav>
    <div class="app-main-content">
      ${repeat(
        menu,
        (m) => m.name,
        (m) => html`
          <h2 .id="${m.name}">${m.name}</h3>
          <hr />
          ${repeat(
            m.children,
            (c) => c,
            (c) =>
              html`<h3 .id="${c}">${c}</h3>
                <mark-down
                  :locale="${gloabl.locale}"
                  :filename="${c.toLowerCase() + '.md'}"
                ></mark-down> `
          )}
        `
      )}
    </div>
    <style>
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
        padding: 0 1rem;
        margin: 0 auto;
        box-sizing: border-box;
      }

      .app-main-content hr {
        border: 1px solid rgba(239, 51, 53, 0.4);
      }
    </style>`
})
