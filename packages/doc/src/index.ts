import { html, render, component, useEffect, useStyle } from '@gallop/gallop'
import './layout/AppMain'
import './layout/SideMenu'
import './registry'
import './styles/index.scss'
import { GithubCorner } from '@doc/components/GithubCorner'
import style from './index.scss?inline'

component('app-root', function () {
  useStyle(() => style, [])

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
