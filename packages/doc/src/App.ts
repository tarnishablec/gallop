import {
  html,
  render,
  component,
  useStyle,
  useEffect,
  ReactiveElement
} from '@gallop/gallop'
import './layout/AppMain'
import './layout/SideMenu'
import './registry'
import './styles'
import { GithubCorner } from './components/GithubCorner'
import raw from './app.scss?raw'

component('app-root', function (this: ReactiveElement) {
  useStyle(() => raw, [])

  useEffect(() => {
    const sidemenu = this.$root.querySelector('side-menu')!
    this.addEventListener('click', (e) => {
      if (e.composedPath().includes(sidemenu)) {
        sidemenu?.classList.add('active')
        sidemenu?.classList.remove('shaped')
      } else {
        sidemenu?.classList.remove('active')
        sidemenu?.classList.add('shaped')
      }
    })
  }, [])

  return html`<side-menu class="shaped"></side-menu>
    <app-main></app-main> ${GithubCorner()} `
})

render(html` <app-root></app-root> `)
