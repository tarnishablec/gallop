import { html, useStyle } from '@gallop/gallop'
import style from './index.scss?inline'

export function Menu() {
  useStyle(() => style, [])
  return html` <div></div> `
}
