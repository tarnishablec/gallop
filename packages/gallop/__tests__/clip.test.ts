import { html } from '../src'
import { getVals } from '../src/clip'

const a = 1

describe('clip', () => {
  const shaClip = html`
    <div>this is test shaClip ${a}</div>
    <div>this si test tail</div>
  `

  test('ShallowClip', () => {
    expect(shaClip.do(getVals)).toEqual([1])
  })
})
