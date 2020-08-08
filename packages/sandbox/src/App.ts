import {
  render,
  html,
  component,
  useState,
  useEffect,
  useMemo,
  ReactiveElement,
  dynamic,
  repeat
} from '@gallop/gallop'

component(
  'test-a',
  ({ text }: { text: string }) => html`<div>
    this is test a&nbsp;${text}
    <div>
      <slot>
    </div>
  </div>`
)

component('test-mmm', function (this: ReactiveElement) {
  const [state] = useState({ a: 1, b: 2, arr: [1, 2, 3, 4, 5, 6, 7, 8, 9] })

  const { a, b } = state
  const memo = useMemo(() => a + b, [a, b])

  useEffect(() => {
    setTimeout(() => this.queryRoot<HTMLButtonElement>('button').click(), 1000)
  }, [])

  return html` <div>${memo}</div>
    <button
      @click="${() => {
        state.a++
        state.b++
      }}"
    >
      aaa
    </button>
    <div>
      ${dynamic({
        name: 'test-a',
        props: { text: 'haha' },
        inner: html` <div>${memo}</div> `
      })}
    </div>
    <hr />
    <div>
      <button
        @click="${() => {
          state.arr.unshift(state.arr.pop()!)
          console.log(state.arr)
        }}"
      >
        circle move to start
      </button>
    </div>
    <div>
      ${repeat(
        state.arr,
        (item) => item,
        (item) => html` <div @click="${() => console.log(item)}">${item}</div>`
      )}
    </div>
    <hr />
    <div>
      <button
        @click="${() => {
          state.arr.push(state.arr.shift()!)
          console.log(state.arr)
        }}"
      >
        circle move to end
      </button>
    </div>
    <div>
      ${repeat(
        state.arr,
        (item) => item,
        (item) => html` <div @click="${() => console.log(item)}">${item}</div>`
      )}
    </div>`
})

render(html` <test-mmm></test-mmm> `)
