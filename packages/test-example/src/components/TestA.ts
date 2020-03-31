import { component, html } from '@gallop/gallop'
import { data, context } from '../../App'

export const TestA = () =>
  component(
    'test-a',
    (color: string) =>
      html`
        <div>
          <div .style="${`color:${color}`}">this is test-aaa</div>
          <div>Context: &zwnj;${data.tick}</div>
        </div>
      `.useContext([context]),
    ['color'] //once terser support keeping function arg names, this will be removed
  )
