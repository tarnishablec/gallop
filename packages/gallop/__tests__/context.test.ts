import {
  component,
  html,
  render,
  useEffect,
  ReactiveElement,
  createContext,
  useContext
} from '../src'

describe('context', () => {
  test('normal context', (done) => {
    let div: HTMLDivElement

    const context = createContext({ a: 1 })
    component('test-a', function (this: ReactiveElement) {
      const [data] = useContext(context)

      useEffect(() => {
        const button = this.$root.querySelector('button')!
        expect(button).toBeInstanceOf(HTMLButtonElement)
        setTimeout(() => {
          button.click()
        }, 1000)
      }, [])

      useEffect(() => {
        div = this.$root.querySelector('div')!
      }, [])

      return html`<button @click="${() => data.a++}"></button>
        <div>${data.a}</div> `
    })

    render(html` <test-a></test-a> `)

    setTimeout(() => {
      try {
        expect(context.data.a).toBe(2)
        expect(div.childNodes[1].textContent).toBe('2')
        done()
      } catch (error) {
        done(error)
      }
    }, 2000)
  })
})
