import { html, ReactiveElement } from '@gallop/gallop'

// import style from './index.scss?inline'

export type PanelPropType = {}

export const Panel = function (this: ReactiveElement) {
  return html` <div class="panel-root"></div> `
}
