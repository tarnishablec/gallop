import { html, render, component } from '@gallop/gallop'
import './layout/AppMain'
import './layout/SideMenu'
import './registry'
import './styles'
import { GithubCorner } from './components/GithubCorner'

component(
  'app-root',
  () =>
    html`<side-menu></side-menu> <app-main></app-main> ${GithubCorner()}
      <style>
        :host {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(180px, auto) 1fr auto;
        }

        @media screen and (max-width: 600px) {
          :host {
            grid-template-columns: 1fr auto;
          }

          side-menu {
            position: absolute;
            transform: translateX(-120%);
            min-width: 180px;
          }
        }
      </style>`
)

render(html` <app-root></app-root> `)
