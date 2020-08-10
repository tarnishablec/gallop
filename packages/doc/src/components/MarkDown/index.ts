import { html, raw } from '@gallop/gallop'
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

export const MarkDown = ({
  filename,
  locale = 'zh'
}: {
  filename: Name
  locale?: string
}) => html`<div class="markdown-body">
  ${raw(marked(importMd(filename, locale).default))}
</div>`
