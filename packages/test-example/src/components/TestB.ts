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
      console.log(this)

      let [state] = useState({ text: '' })
      useEffect(() => {
        console.log(this.$root.querySelector('button'))
        console.log(`test-b mounted`)
      }, [])
      return html`
        <div>
          <input
            class="state-text"
            .value="${state.text}"
            @input="${(e: Event) => {
              state.text = (e.target as HTMLInputElement).value
            }}"
          />
          <div>now state.text is : &zwnj;${state.text}</div>
          <button
            @click="${() => {
              state.text = ''
              console.log(this)
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
