import { html } from '../src'
import { markerIndex } from '../src/marker'

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
    `.shaHtml
    const dof = document.createRange().createContextualFragment(domStr)
    expect((dof.firstChild as Element).localName).toBe('div')
    expect(dof.firstChild?.childNodes[2].nodeType).toBe(Node.COMMENT_NODE)
    expect(dof.firstChild?.childNodes[3].nodeType).toBe(Node.COMMENT_NODE)
    expect((dof.firstChild?.childNodes[2] as Comment).data).toBe(
      `{{${markerIndex}}}`
    )
    expect((dof.firstChild?.childNodes[3] as Comment).data).toBe(
      `{{${markerIndex}}}`
    )
  })
})
