import { html, css } from '../src'
import { markerIndex } from '../src/marker'
import { getShaHtml } from '../src/clip'

describe('parse', () => {
  test('html', () => {
    const n = 1
    const domStr = html`
      <div>
        <span>this is span</span>
        <p>this is p</p>
        ${n}
        <div>this is child</div>
        <div>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
      </div>
    `.do(getShaHtml)
    const dof = document.createRange().createContextualFragment(domStr)
    expect((dof.firstChild as Element).localName).toBe('div')
    expect(dof.firstChild?.childNodes[2].nodeType).toBe(Node.COMMENT_NODE)
    expect((dof.firstChild?.childNodes[2] as Comment).data).toBe(`${markerIndex}`)
  })

  test('css', () => {
    const style = css`
      @import '${`https://hellowrold.css`}';
    `
    expect(style).toBe(`@import 'https://hellowrold.css';`)
  })
})
