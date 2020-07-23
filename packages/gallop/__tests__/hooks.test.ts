import {
  useState,
  component,
  html,
  render,
  useEffect,
  Looper,
  useStyle,
  css
} from '../src'
import { ReactiveElement } from '../src/component'

describe('hooks', () => {
  test('useState', (done: () => unknown) => {
    expect(() => useState({ a: 1 })).toThrowError(/Cannot read property/)
    let temp: { a: number }
    component('test-state', () => {
      const [state] = useState({ a: 1 })
      expect(Looper.resolveCurrent().$state).toBe(state)
      temp = state
      return html` <div>${state.a}</div>`
    })

    render(html` <test-state></test-state> `)
    setTimeout(() => {
      expect((document.querySelector('test-state') as ReactiveElement).$state).toBe(
        temp
      )
    }, 0)

    setTimeout(() => {
      done()
    }, 100)
  })

  test('useEffect mount', (done: () => unknown) => {
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

  test('useEffect update', (done: () => unknown) => {
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

    new Promise((resolve) => {
      setTimeout(() => {
        const c = document.querySelector('test-c')!
        expect(
          (c.shadowRoot?.firstChild as HTMLDivElement).getAttribute('style')
        ).toBe(`color:red;background:white`)
        const button = c.shadowRoot?.querySelector('button') as HTMLButtonElement
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

  test('useStyle', (done) => {
    let color: string

    component('test-s', () => {
      useStyle(
        () => css`
          div {
            background: red;
          }
        `,
        []
      )

      return html` <div>111</div> `
    })

    render(html`<test-s></test-s>`)

    const el = document.querySelector('test-s') as ReactiveElement

    setTimeout(() => {
      const div = el.$root.querySelector('div')!
      expect(div).toBeInstanceOf(HTMLDivElement)
      color = window.getComputedStyle(div).getPropertyValue('background-color')
    }, 500)

    setTimeout(() => {
      try {
        expect(color).toBe('rgb(255, 0, 0)')
        done()
      } catch (error) {
        done(error)
      }
    }, 600)
  })
})
