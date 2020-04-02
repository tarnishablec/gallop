import {
  useState,
  component,
  html,
  render,
  useEffect,
  createContext
} from '../src'
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

  test('mount', (done: Function) => {
    let testres = 1

    component('test-a', function (
      this: UpdatableElement,
      name: string = 'yihan'
    ) {
      let [state] = useState({ tik: 1, children: [2, 3, 4] })

      useEffect(() => {
        testres += 1
        expect(testres).toBe(2)
        done()
      }, [])
      return html` <div>${state.children[0]}</div>
        <div>${name}</div>`
    })
    render(html` <test-a></test-a> `)
  })

  test('disconnect', (done: Function) => {
    let testDis = 1
    let [data, context] = createContext({ tok: 2 })

    let cache: UpdatableElement
    component('test-b', function (this: UpdatableElement) {
      let [state] = useState({ tik: 1, children: [2, 3, 4] })

      useEffect(() => {
        return () => {
          testDis += 2
        }
      }, [])

      return html`
        <div>${state.children[0]}</div>
        <div>${data.tok}</div>
        <button @click="${() => (state.tik += 1)}"></button>
        <button @click="${() => (data.tok += 100)}"></button>
        <test-a :name="good"></test-a>
        <test-a :name="${'good'}"></test-a>
        <test-a :name="${2}"></test-a>
      `.useContext([context])
    })

    render(html` <test-b></test-b> `)
    setTimeout(() => {
      const instance = document.querySelector('test-b') as UpdatableElement
      instance.shadowRoot
        ?.querySelectorAll('button')[1]
        .dispatchEvent(new Event('click'))
      cache = document.body.removeChild(instance)
    }, 500)

    setTimeout(() => {
      expect(data.tok).toBe(102)
    }, 600)

    setTimeout(() => {
      try {
        expect(testDis).toBe(3)
        expect(cache.$contexts?.size).toBe(0)
        done()
      } catch (error) {
        done(error)
      }
    }, 1000)
  })

  test('update', (done: Function) => {
    let testUpdate = 1

    const Pure1 = (a: string) => html`<div>pure${a}</div>`
    const Pure2 = () => html`<span>pure</span>`

    component('test-c', function (this: UpdatableElement) {
      let [state] = useState({ tik: 1, children: [2, 3, 4] })

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

    new Promise(() => {
      setTimeout(() => {
        try {
          expect(testUpdate).toBe(3)
          done()
        } catch (error) {
          done(error)
        }
      }, 1000)
    })
  })
})
