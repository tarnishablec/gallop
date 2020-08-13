import { html, raw, component } from '@gallop/gallop'
import marked from 'marked'
import { highlightAuto } from 'highlight.js'
import type { Name } from '@doc/contexts'
import githubUrl from './github.css?link'
import highlightUrl from './highlight.css?link'

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

component(
  'mark-down',
  ({ filename, locale = 'zh' }: { filename: Name; locale?: string }) => html`
    <link rel="stylesheet" .href="${githubUrl}" />
    <link rel="stylesheet" .href="${highlightUrl}" />
    <div class="markdown-body">
      ${raw(
        marked(importMd(filename, locale).default, {
          highlight: (code) => highlightAuto(code).value
        })
      )}
    </div>
    <style>
      a {
        color: var(--active-color) !important;
        margin: 0 0.2rem;
      }
    </style>
  `
)
