import { cleanDofStr } from '../src/dom'

describe('dom', () => {
  test('range', () => {
    const domStr = cleanDofStr(`
    <div>
      <span>this is span</span>
      <p>this is p</p>
      <!--comment1-->
      <!--comment2-->
      <div>this is child</div>
      <div>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </div>
  `)
    const dof = document.createRange().createContextualFragment(domStr)
    expect((dof.firstChild as Element).localName).toBe('div')
    expect(dof.firstChild?.childNodes[2].nodeType).toBe(Node.COMMENT_NODE)
    expect(dof.firstChild?.childNodes[3].nodeType).toBe(Node.COMMENT_NODE)
    expect((dof.firstChild?.childNodes[2] as Comment).data).toBe(`comment1`)
    expect((dof.firstChild?.childNodes[3] as Comment).data).toBe(`comment2`)
    const comment1 = dof.firstChild?.childNodes[2] as Comment
    const comment2 = dof.firstChild?.childNodes[3] as Comment
    const range = document.createRange()
    range.setStart(comment1, 0)
    range.setEnd(comment2, 0)
  })
})
