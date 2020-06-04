import { component, html, useState, repeat } from '@gallop/gallop'

component('side-menu', () => {
  const [menu] = useState([
    { name: 'Introduction', children: ['Overview', 'Installation'] }
  ])

  return html`
    <header>
      <a href="/">Gallop</a>
    </header>
    <div class="menu-list-container">
      <ul>
        ${repeat(
          menu,
          (m) => m.name,
          (m) => html`
            <li class="primary-menu">
              <a .href="${`/#/${m.name}`}">
                ${m.name}
              </a>
              ${m.children
                ? html`<ul>
                    ${repeat(
                      m.children,
                      (n) => n,
                      (n) => html`
                        <li class="child-menu">
                          <a .href="${`/#/${n}`}">${n}</a>
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

    <style>
      :host {
        background: rgba(0, 0, 0, 0.2);
        display: grid;
        grid-auto-rows: min-content 1fr;
        box-shadow: 0 0 3px 1px gray;
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
        font-size: 1.2rem;
        color: #333;
      }

      li.child-menu > a {
        color: #666;
      }

      header span {
        cursor: pointer;
      }
    </style>
  `
})
