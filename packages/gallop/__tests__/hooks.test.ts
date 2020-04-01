import { useState, component, html, render } from '../src'
import { resolveCurrentHandle, UpdatableElement } from '../src/component'

describe('hooks', () => {
  test('useState', () => {
    expect(() => useState({ a: 1 })).toThrowError(/Cannot read property/)
    let temp: { a: number }
    component('test-state', () => {
      let [state] = useState({ a: 1 })
      expect(resolveCurrentHandle().$state).toBe(state)
      temp = state
      return html` <div>${state.a}</div>`
    })

    render(html` <test-state></test-state> `)
    setTimeout(() => {
      expect(
        (document.querySelector('test-state') as UpdatableElement).$state
      ).toBe(temp)
    }, 0)
  })
})
