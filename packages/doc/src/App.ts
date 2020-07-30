import { html, render, component, useStyle, css } from '@gallop/gallop'
import './layout/AppMain'
import './layout/SideMenu'
import './registry'
import './styles'
import { GithubCorner } from './components/GithubCorner'
import raw from './app.scss?raw'

component('app-root', () => {
  useStyle(
    () =>
      css`
        ${raw}
      `,
    []
  )

  return html`<side-menu></side-menu> <app-main></app-main> ${GithubCorner()} `
})

render(html` <app-root></app-root> `)
