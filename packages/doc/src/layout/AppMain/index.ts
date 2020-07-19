import { component, html, repeat, useContext } from '@gallop/gallop'
import { menu, context } from '../SideMenu'

component('app-main', () => {
  useContext([context])

  return html` <header>
      <a href="https://github.com/tarnishablec/gallop">github</a>
    </header>
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
                <mark-down :filename="${c.toLowerCase() + '.md'}"></mark-down> `
          )}
        `
      )}
    </div>
    <style>
      :host {
        --header-height: 3.6rem;
        height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      header {
        height: var(--header-height);
        font-size: 1.1rem;
        background: white;
        box-shadow: 0 2px 2px -2px gray;
        display: grid;
        padding: 0 3rem;
        place-items: center end;
      }

      header a {
        text-decoration: none;
        color: black;
      }

      .app-main-content {
        overflow-y: auto;
        padding: 0 3rem;
      }
    </style>`
})
