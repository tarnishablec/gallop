import { component, ReactiveElement } from '../src/component'
import {
  html,
  createContext,
  useEffect,
  render,
  useState,
  useContext
} from '../src'
import { createClip } from '../src/clip'
import { isMarker } from '../src/is'

describe('component', () => {
  test('register component', () => {
    let [data, context] = createContext({ tik: 0 })

    let a = 1
    let b = 1

    const hobbies = ['sing', 'jump', 'rap', '🏀']
    component(
      'sandbox-a',
      function (
        this: ReactiveElement,
        name: string = 'yihan',
        age: number,
        hobbies: string[],
        status: { hungry: boolean } = { hungry: true }
      ) {
        let [state] = useState({ tok: 100 })

        useContext([context])

        useEffect(() => {
          a++
          expect(this.localName).toBe('sandbox')
          expect(this.$state).toEqual({ tok: 100 })
        }, [])

        let sha = html`
          <div id="root" style="color:red" .class=${'sandbox'}>
            <div>${name}</div>
            <div>${age}</div>
            <div>${hobbies}</div>
            <div>${status.hungry}</div>
            <div>${data.tik}</div>
            <div>${state.tok}</div>
            <button
              @click="${(e: Event) => {
                data.tik += 1
                state.tok += 1
                b += 2
                console.log(data.tik)
                console.log(e)
              }}"
            ></button>
          </div>
        `

        expect(
          isMarker(
            sha
              .do(createClip)
              .dof.querySelector('#root')
              ?.getAttribute('.class')
          )
        ).toBe(true)

        expect(
          isMarker(
            sha.do(createClip).dof.querySelector('#root')?.getAttribute('style')
          )
        ).toBe(false)

        return sha
      },
      {
        propList: ['name', 'age', 'hobbies', 'status']
      }
    )

    render(html` <sandbox-a :hobbies="${hobbies}" :age="24"></sandbox-a> `)

    const instance = document.body.querySelector('sandbox-a')!

    expect(instance instanceof ReactiveElement).toBe(true)
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

  test('mix', () => {
    component(
      'test-dispatch',
      (num: number) => html` <div>dispatch${num}</div> `
    )
    render(
      html`
        ${[1, 2, 3].map((n) =>
          n % 2 ? html` <test-dispatch :num="${n}"></test-dispatch> ` : 'hello'
        )}
      `
    )

    const coms = document.querySelectorAll('test-dispatch')
    expect(coms.length).toBe(2)
    setTimeout(() => {
      expect(coms[0].shadowRoot?.firstChild?.textContent).toBe('dispatch1')
      expect((document.body.childNodes[1] as Text).data).toBe('2')
    }, 0)
  })
})
