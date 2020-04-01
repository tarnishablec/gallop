import { cleanDofStr, insertAfter, removeNodes } from '../src/dom'

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
  })

  test('insertAfter', () => {
    const div = document.createElement('div')
    insertAfter(div, new Text('hello'))
    expect(div.firstChild instanceof Text).toBe(true)
    const text = div.firstChild as Text
    expect((div.firstChild as Text).data).toBe('hello')
    insertAfter(div, new Text('world'), text)
    expect((text.nextSibling as Text).data).toBe('world')
  })

  test('removeNodes', () => {
    const div = document.createElement('div')
    for (let i = 0; i < 20; i++) {
      div.append(new Text(i.toString()))
    }
    expect(div.childNodes.length).toBe(20)
    removeNodes(div, div.firstChild, div.childNodes[2])
    expect(div.childNodes.length).toBe(18)
    expect((div.firstChild as Text).data).toBe('2')
    removeNodes(div, div.firstChild)
    expect(div.childNodes.length).toBe(0)
  })
})
