import { html, render, component, useEffect } from '@gallop/gallop'
import './layout/AppMain'
import './layout/SideMenu'
import './registry'
import './styles/index.scss'
import { GithubCorner } from './components/GithubCorner'
import href from './index.scss?preload'

component('app-root', function () {
  // useStyle(() => style, [])

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

  return html`
    <link rel="stylesheet" .href="${href}" />
    <side-menu class="shaped"></side-menu>
    <app-main></app-main> ${GithubCorner()}
  `
})

render(html` <app-root></app-root> `)
