/* eslint-disable @typescript-eslint/no-unused-vars */

import { html, raw, component } from '@gallop/gallop'
import marked from 'marked'
import type { Name } from '../../contexts'
// import githubUrl from './github.css?link'
import prismUrl from './prism.css?preload'

console.log(prismUrl)

component(
  'mark-down',
  ({ filename, locale = 'zh' }: { filename: Name; locale?: string }) => html`
    <div class="markdown-body"></div>
    <style>
      a {
        color: var(--active-color) !important;
        margin: 0 0.2rem;
      }
    </style>
  `
)
