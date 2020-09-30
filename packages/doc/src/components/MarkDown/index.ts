import { html, raw, component } from '@gallop/gallop'
import marked from 'marked'
import type { Name } from '@doc/contexts'
import githubUrl from './github.css?link'
import prismUrl from './prism.css?link'

const req = require.context('@doc/markdown', true, /\.md$/, 'sync')

const importMd: (filename: Name, locale?: string) => { default: string } = (
  filename,
  locale = 'zh'
) => {
  try {
    return req(`./${locale}/${filename}.md`)
  } catch (error) {
    try {
      return req(`./zh/${filename}.md`)
    } catch (e) {
      return { default: '`/** WIP **/`' }
    }
  }
}

component(
  'mark-down',
  ({ filename, locale = 'zh' }: { filename: Name; locale?: string }) => html`
    <link rel="stylesheet" .href="${githubUrl}" />
    <link rel="stylesheet" .href="${prismUrl}" />
    <div class="markdown-body">
      ${raw(
        marked(importMd(filename, locale).default, {
          highlight: (code, lang) => {
            const grammar = Prism.languages[lang]
            return grammar ? Prism.highlight(code, grammar, lang) : code
          }
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
