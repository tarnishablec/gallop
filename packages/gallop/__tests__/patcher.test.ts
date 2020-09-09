import { html } from '../src'

describe('patcher', () => {
  test('style should not in template', () => {
    const a = 1
    const template = html`<div>1</div>
      <style>
        ${a}
      </style>`
    expect(() => template.createPatcher()).toThrowError(
      /Can not put dynamic part inside or after/
    )
  })
})
