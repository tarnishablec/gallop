import { html, render, component } from '@gallop/gallop'
import './registry'
import './styles'
import { GithubCorner } from './components/GithubCorner'

component(
  'app-root',
  () => html`<side-menu></side-menu> <app-main></app-main> ${GithubCorner()} `
)

render(html` <app-root></app-root> `)
