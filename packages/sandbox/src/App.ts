import {
  render,
  html,
  component,
  useState,
  useEffect,
  useMemo,
  ReactiveElement
} from '@gallop/gallop'

component('test-mmm', function (this: ReactiveElement) {
  const [state] = useState({ a: 1, b: 2 })

  const { a, b } = state
  const memo = useMemo(() => a + b, [a, b])

  useEffect(() => {
    setTimeout(() => {
      this.$root.querySelector('button')?.dispatchEvent(new Event('click'))
    }, 1000)
  }, [])

  return html` <div>${memo}</div>
    <button
      @click="${() => {
        state.a++
        state.b++
      }}"
    >
      aaa
    </button>`
})

render(html` <test-mmm></test-mmm> `)
