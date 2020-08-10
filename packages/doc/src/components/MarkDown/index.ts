import { component, html, ReactiveElement, useStyle, css, raw } from '@gallop/gallop'
import url from './github.css?url'
import marked from 'marked'
import type { Name } from '@doc/contexts'

const req = require.context('@doc/markdown', true, /\.md$/, 'sync')

const importMd: (filename: Name, locale?: string) => { default: string } = (
  filename,
  locale = 'zh'
) => {
  try {
    return req(`./${locale}/${filename}.md`)
  } catch (error) {
    return { default: '' }
  }
}

component('mark-down', function (
  this: ReactiveElement,
  {
    filename,
    locale = 'zh'
  }: {
    filename: Name
    locale?: string
  } /* filename do not need .md extension */
) {
  useStyle(
    () => css`
      @import '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/default.min.css';
      @import '${url}';
      a {
        color: var(--active-color) !important;
        margin: 0 0.2em;
      }
    `,
    []
  )

  return html`<div class="markdown-body">
    ${raw(marked(importMd(filename, locale).default))}
  </div>`
})
