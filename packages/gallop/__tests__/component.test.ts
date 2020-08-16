import { component, ReactiveElement, isReactive } from '../src/component'
import {
  html,
  createContext,
  useEffect,
  render,
  useState,
  useContext
} from '../src'
import { createPatcher } from '../src/clip'
import { marker } from '../src/marker'

describe('component', () => {
  test('register component', () => {
    const [data, context] = createContext({ tik: 0 })

    let a = 1
    let b = 1

    const hobbies = ['sing', 'jump', 'rap', '🏀']
    component('sandbox-a', function (
      this: ReactiveElement,
      {
        name = 'yihan',
        age,
        hobbies,
        status = { hungry: true }
      }: {
        name: string
        age: number
        hobbies: string[]
        status: { hungry: boolean }
      }
    ) {
      const [state] = useState({ tok: 100 })

      useContext([context])

      useEffect(() => {
        a++
        expect(this.localName).toBe('sandbox')
        expect(this.$state).toEqual({ tok: 100 })
      }, [])

      const sha = html`
        <div id="root" style="color:red" .class=${'sandbox'}>
          <div>${name}</div>
          <div>${age}</div>
          <div>${hobbies}</div>
          <div>${status.hungry}</div>
          <div>${data.tik}</div>
          <div>${state.tok}</div>
          <button
            @click="${() => {
              data.tik += 1
              state.tok += 1
              b += 2
            }}"
          ></button>
        </div>
      `

      expect(
        sha
          .do(createPatcher)
          .dof.querySelector('#root')
          ?.getAttribute('.class') === marker
      ).toBe(true)

      expect(
        sha
          .do(createPatcher)
          .dof.querySelector('#root')
          ?.getAttribute('style') == marker
      ).toBe(false)

      return sha
    })

    render(html` <sandbox-a :hobbies="${hobbies}" :age="24"></sandbox-a> `)

    const instance = document.body.querySelector('sandbox-a')!

    expect(isReactive(instance)).toBe(true)
    expect(instance.parentNode).toBe(document.body)

    setTimeout(() => {
      expect(!!instance.shadowRoot).toBe(true)
      expect(instance.shadowRoot?.childNodes.length).toBe(1)
      expect(
        instance!.shadowRoot?.firstChild?.childNodes[6] instanceof
          HTMLButtonElement
      ).toBe(true)
      expect(
        (instance!.shadowRoot?.firstChild?.childNodes[6] as HTMLDivElement)
          .textContent
      ).toBe(100)
      const button = instance!.shadowRoot?.firstChild
        ?.childNodes[6] as HTMLButtonElement
      button.dispatchEvent(new Event('click'))
      expect(
        instance.shadowRoot?.querySelector('#root') instanceof HTMLDivElement
      ).toBe(true)
      expect(a).toBe(2)
      expect(b).toBe(3)
      expect(data.tik).toBe(101)
      expect(
        (instance!.shadowRoot?.firstChild?.childNodes[6] as HTMLDivElement)
          .textContent
      ).toBe(101)
    }, 0)

    const TestName = () => component('asda', () => html``)
    expect(TestName).toThrowError()
  })

  test('map funtion should prompt error', () => {
    component(
      'test-dispatch',
      ({ num }: { num: number }) => html` <div>dispatch${num}</div> `
    )
    expect(() =>
      render(
        html`
          ${[1, 2, 3].map((n) =>
            n % 2
              ? html` <test-dispatch :num="${n}"></test-dispatch> `
              : 'hello'
          )}
        `
      )
    ).toThrowError()
  })
})
