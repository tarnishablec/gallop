import {
  getFuncArgNames,
  extractProps,
  shallowEqual,
  keyListDiff
} from '../src/utils'
import { html } from '../src/parse'
import { getShaHtml } from '../src/clip'

describe('utils', () => {
  test('getFuncArgNames', () => {
    const func = (
      _you = { name: 'yi,han', children: [{ his: true }] },
      b: number,
      c: Array<number> = [12, 3]
    ) => `${_you.name}${b}${c[1]}`

    const builder = (
      /*asdasddfgas""daq,asdas{}*/ name: /*asdasddfgas""daq,asdas{}*/ string,
      /*asdasddfgas""daq,asdas{}*/ age: number = 25
    ) => html` <h3>name is &zwnj;${name}; age is ${age}</h3> `

    expect(getFuncArgNames(func)).toEqual(['_you', 'b', 'c'])
    expect(getFuncArgNames(getFuncArgNames)).toEqual(['func'])
    expect(
      getFuncArgNames((/*asdasddfgas""daq,asdas{}*/) => console.log(1))
    ).toEqual([])
    expect(
      getFuncArgNames(
        (
          a: { person: { name: string; age: number } } = {
            person: { name: 'yihan', age: 25 }
          },
          b_ss: number = 'asd,"{}asd'.length
        ) => console.log(a.person.age + b_ss)
      )
    ).toEqual(['a', 'b_ss'])
    expect(getFuncArgNames(builder)).toEqual(['name', 'age'])
  })

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

  test('diff result', () => {
    const a = [9, 1, 2, 5, 4, 6, 8, 10]
    const b = [7, 3, 9, 8, 5, 0, 4]

    let res = keyListDiff(a, b)

    expect(res).toEqual([
      { type: 'insert', newIndex: 0, after: null },
      { type: 'insert', newIndex: 1, after: 7 },
      { type: 'move', oldIndex: 0, after: 3 },
      { type: 'move', oldIndex: 3, after: 8 },
      { type: 'insert', newIndex: 5, after: 5 },
      { type: 'move', oldIndex: 4, after: 0 },
      { type: 'remove', oldIndex: 1 },
      { type: 'remove', oldIndex: 2 },
      { type: 'remove', oldIndex: 5 },
      { type: 'remove', oldIndex: 7 }
    ])
  })
})
