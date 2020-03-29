import { component, html } from '@gallop/gallop'
import { data, context } from '../../App'

export const TestA = () =>
  component('test-a', (color: string = 'red') =>
    html`
      <div>
        <div .style="${`color:${color}`}">this is test-aaa</div>
        <div>Context: &zwnj;${data.tick}</div>
      </div>
    `.useContext([context])
  )
