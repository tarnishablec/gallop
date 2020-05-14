import { html, render, component } from '@gallop/gallop'
import './register'
import './styles'

component('app-root', () => html`<side-menu></side-menu> <app-main></app-main>`)

render(html` <app-root></app-root> `)
