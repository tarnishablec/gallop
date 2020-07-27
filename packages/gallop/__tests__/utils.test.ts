import { extractProps, shallowEqual, hashify, tryParseToString } from '../src/utils'
import { html } from '../src/parse'
import { getShaHtml } from '../src/clip'
import { cleanDomStr } from '../src/dom'
import { createProxy } from '../src/reactive'

describe('utils', () => {
  test('extractProp', () => {
    const hobbies = ['sing', 'jump', 'rap', '🏀']
    const shaClip = html`
      <div :name="yihan" :age="66" :height="${111}" :hobbies="${hobbies}">
        hello
      </div>
    `
    const div = document.createElement('div')
    div.append(
      document.createRange().createContextualFragment(shaClip.do(getShaHtml))
    )
    expect(extractProps((div.firstChild as Element).attributes)).toEqual({
      name: 'yihan',
      age: '66'
    })
  })

  test('shallowEqual', () => {
    const testA = { a: 'this is a', b: () => console.log(1), c: null }
    const testB = { a: 'this is a', b: () => console.log(1), c: null }

    const func = () => console.log(1)

    const testC = { a: 'this is a', b: func, c: null }
    const testD = { a: 'this is a ', b: func, c: null }
    const testE = { a: 'this is a', b: func, c: null }

    class Test {
      a: number
      b: number
      constructor(a: number, b: number) {
        this.a = a
        this.b = b
      }
    }
    const tt = new Test(1, 2)

    const testF = { a: tt }
    const testG = { a: new Test(1, 2) }
    const testH = { a: tt }

    expect(shallowEqual(testA, testB)).toBe(false)
    expect(shallowEqual(testC, testD)).toBe(false)
    expect(shallowEqual(testC, testE)).toBe(true)
    expect(shallowEqual(testF, testG)).toBe(false)
    expect(shallowEqual(testF, testH)).toBe(true)
    expect(shallowEqual(tt, new Test(1, 2))).toBe(true)
    expect(shallowEqual(undefined, undefined)).toBe(true)
    expect(shallowEqual(null, null)).toBe(true)
    expect(shallowEqual(func, () => console.log(1))).toBe(false)
  })

  test('hashify', () => {
    const domStr1 = cleanDomStr(`
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
    const domStr2 = cleanDomStr(`
    <div>
      <span>this is span</span>
      <p>this is p</p>
      <!--comment1-->
      <!--comment2-->
      <div>this is child</div>
      <div>
        <ul>
          <li>2</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </div>
  `)
    const domStr3 = cleanDomStr(`
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
    expect(hashify(domStr1) === hashify(domStr2)).toBe(false)
    expect(hashify(domStr1) === hashify(domStr3)).toBe(true)
  })

  test('tryParseToString', () => {
    const p = createProxy({ a: 1 })
    expect(tryParseToString(p)).toBe('{"a":1}')
  })
})
