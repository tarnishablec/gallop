import {
  cleanDomStr,
  insertAfter,
  removeNodes,
  generateEventOptions
} from '../src/dom'

describe('dom', () => {
  test('range', () => {
    const domStr = cleanDomStr(`
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
    removeNodes(div.childNodes[0], div.childNodes[2])
    expect(div.childNodes.length).toBe(19)
    expect((div.firstChild as Text).data).toBe('0')
    removeNodes(div.childNodes[0], div.childNodes[2], true)
    expect((div.firstChild as Text).data).toBe('4')
    expect(div.childNodes.length).toBe(16)
  })

  test('generateEventOptions', () => {
    const set = new Set(['once', 'passive'])
    expect(generateEventOptions(set)).toEqual({
      once: true,
      passive: true,
      capture: false
    } as EventListenerOptions)
  })
})
