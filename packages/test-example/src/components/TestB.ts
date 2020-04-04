import {
  component,
  html,
  useEffect,
  useState,
  UpdatableElement
} from '@gallop/gallop'

export const TestB = () => {
  component(
    'test-b',
    function (this: UpdatableElement) {
      let [state] = useState({ text: '', tick: 0 })
      useEffect(() => {
        console.log(`test-b mounted`)
        for (let i = 0; i < 100; i++) {
          state.tick += 1 //only trigger rerendering once
        }
        return () => {
          console.log(`b disconnected`)
        }
      }, [])

      useEffect(() => {
        console.log('changed')
        return () => {
          console.log('bbbbbbbb nnnn')
        }
      }, [state.text])
      return html`
        <div>
          <input
            class="state-text"
            .value="${state.text}"
            @input="${(e: Event) => {
              state.text = (e.target as HTMLInputElement).value
            }}"
          />
          <div>tick value:${state.tick}</div>
          <div>now state.text is : &zwnj;${state.text}</div>
          <button
            @click="${() => {
              state.text = ''
              const span = this.$root.querySelector(
                'span.test-b-span'
              ) as HTMLSpanElement
              span.textContent = 'cleaned'
            }}"
          >
            clean state
          </button>
          <span class="test-b-span" style="display:block">
            span gonna change!
          </span>
        </div>
      `
    },
    undefined,
    false
  )
}
