import { html } from '../src'
import { createPatcher } from '../src/clip'

describe('patcher', () => {
  test('style should not in template', () => {
    const a = 1
    const template = html`<div>1</div>
      <style>
        ${a}
      </style>`
    expect(() => template.do(createPatcher)).toThrowError(
      /Can not put dynamic part inside or after/
    )
  })
})
