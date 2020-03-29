import { component, html } from '@gallop/gallop'
import { data, context } from '../../App'

export const TestA = () =>
  component('test-a', (name: string = 'a') =>
    html`
      <div>
        <div>this is test-${name}</div>
        <div>${data.tick}</div>
      </div>
    `.useContext([context])
  )
