import { component, html, useContext } from '@gallop/gallop'
import { data, context } from '../../App'

export const TestA = component(
  'test-a',
  (color: string = 'green') => {
    const { tick } = data

    useContext([context])

    return html`
      <div>
        <div .style="${`color:${color}`}">this is test-aaa</div>
        <div>Context: &zwnj;${tick}</div>
        <slot name="aslot"></slot>
        <div>test-a end</div>
      </div>
    `
  },
  ['color'] //once terser support keeping function arg names, this will be removed
)
