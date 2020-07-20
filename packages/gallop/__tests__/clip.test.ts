import { html, createContext, component } from '../src'
import { getVals, createPatcher } from '../src/clip'

component('test-test', ({ name }: { name: string }) => html`<div>${name}</div>`)

const a = 1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [data, context] = createContext({ a: 1 })
describe('clip', () => {
  const click = () => alert(1)
  const shaClip = html`
    <div>this is test shaClip ${a}</div>
    <div>this si test tail ${data.a}</div>
    <button @click="${click}"></button>
    <test-test :name="${a}"></test-test>
    <div .style="${`color:red`}">style</div>
  `

  test('ShallowClip', () => {
    const clip = shaClip.do(createPatcher)
    expect(shaClip.do(getVals)).toEqual([1, 1, click, 1, 'color:red'])
    expect(clip.dof.firstChild?.childNodes[1].nodeType).toEqual(Node.COMMENT_NODE)
  })
})
