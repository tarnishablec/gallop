import { directive, ensurePartType, html, render, PropPart } from '../src'

describe('directive', () => {
  test('part type check', () => {
    const testd = directive((v: unknown) => (part) => {
      if (!ensurePartType(part, PropPart)) return
      part.setValue(v)
    })

    expect(() => {
      const template = html`<div>${testd(111)}</div>`
      render(template)
    }).toThrowError()
  })
})
