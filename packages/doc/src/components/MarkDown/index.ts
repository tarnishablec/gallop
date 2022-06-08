import { html, raw, component } from '@gallop/gallop'
import marked from 'marked'
import type { Name } from '../../contexts'

const marks = import.meta.globEager('../../markdown/*/*.md')

component(
  'mark-down',
  ({ filename, locale = 'zh' }: { filename: Name; locale?: string }) => html`
    <link rel="stylesheet" href="./github.css" />
    <link rel="stylesheet" href="./prism.css" />
    <div class="markdown-body">
      ${raw(
        marked(
          marks[`../../markdown/${locale}/${filename}.md`]?.default ??
            '**WIP**',
          {
            highlight: (code, lang) => {
              const grammar = Prism.languages[lang]
              return grammar ? Prism.highlight(code, grammar, lang) : code
            }
          }
        )
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
