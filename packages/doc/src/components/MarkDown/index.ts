import { html, raw, component, suspense } from '@gallop/gallop'
import marked from 'marked'
import type { Name } from '../../contexts'

component(
  'mark-down',
  ({ filename, locale = 'zh' }: { filename: Name; locale?: string }) => html`
    <link rel="stylesheet" href="assets/github.css" />
    <link rel="stylesheet" href="assets/prism.css" />
    <div class="markdown-body">
      ${suspense(async () => {
        try {
          const res = (
            await import(`../../markdown/${locale}/${filename}.md?raw`)
          ).default
          return raw(
            marked(res, {
              highlight: (code, lang) => {
                const grammar = Prism.languages[lang]
                return grammar ? Prism.highlight(code, grammar, lang) : code
              }
            })
          )
        } catch (error) {
          return '** WIP **'
        }
      })}
    </div>
    <style>
      a {
        color: var(--active-color) !important;
        margin: 0 0.2rem;
      }
    </style>
  `
)
