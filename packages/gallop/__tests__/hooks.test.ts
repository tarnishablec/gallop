import { useState, component, html, render, useEffect } from '../src'
import { resolveCurrentHandle, ReactiveElement } from '../src/component'

describe('hooks', () => {
  test('useState', (done: Function) => {
    expect(() => useState({ a: 1 })).toThrowError(/Cannot read property/)
    let temp: { a: number }
    component('test-state', () => {
      const [state] = useState({ a: 1 })
      expect(resolveCurrentHandle().$state).toBe(state)
      temp = state
      return html` <div>${state.a}</div>`
    })

    render(html` <test-state></test-state> `)
    setTimeout(() => {
      expect(
        (document.querySelector('test-state') as ReactiveElement).$state
      ).toBe(temp)
    }, 0)

    setTimeout(() => {
      done()
    }, 100)
  })

  test('mount', (done: Function) => {
    let testres = 1

    component('test-a', function (
      this: ReactiveElement,
      { name = 'yihan' }: { name: string }
    ) {
      const [state] = useState({ tik: 1, children: [2, 3, 4] })

      useEffect(() => {
        testres += 1
        expect(testres).toBe(2)
      }, [])
      return html` <div>${state.children[0]}</div>
        <div>${name}</div>`
    })
    render(html` <test-a></test-a> `)
    setTimeout(() => {
      done()
    }, 100)
  })

  test('update', (done: Function) => {
    let testUpdate = 1

    const Pure1 = (a: string) => html`<div>pure${a}</div>`
    const Pure2 = () => html`<span>pure</span>`

    component('test-c', function (this: ReactiveElement) {
      const [state] = useState({ tik: 1, children: [2, 3, 4] })

      useEffect(() => {
        testUpdate += 2
      }, [state.tik])

      useEffect(() => {
        testUpdate += 100
      }, [state.children])

      return html`
        <div style="color:red" .style="${`background:white`}">
          ${state.children[0]}
        </div>
        <button
          .style="${`color:red`}"
          .width="${12}"
          @click="${() => (state.tik += 1)}"
        ></button>
        ${state.tik === 1 ? Pure1('1') : Pure2()}
        ${state.tik === 1 ? Pure1('1') : Pure1('2')}
        <input .value="${state.tik}" type="text" />
      `
    })

    render(html` <test-c></test-c> `)

    new Promise((resolve: Function) => {
      setTimeout(() => {
        const c = document.querySelector('test-c')!
        expect(
          (c.shadowRoot?.firstChild as HTMLDivElement).getAttribute('style')
        ).toBe(`color:red;background:white`)
        const button = c.shadowRoot?.querySelector(
          'button'
        ) as HTMLButtonElement
        button.dispatchEvent(new Event('click'))
        resolve()
      }, 500)
    })

    setTimeout(() => {
      expect(testUpdate).toBe(5)
    }, 600)

    setTimeout(() => {
      done()
    }, 1000)
  })
})
