import { html } from '@gallop/gallop'

const a = 1

const test = html`
  <div .style="${a}" #ref="${a}">
    ${a} haha ${a}
    <span>hello</span>
  </div>
  ${[1, 2, 3].map(a =>
    a % 2
      ? html`
          <div>${a}</div>
        `
      : a
  )}
  <span>asdas</span>
`

console.log(test)
