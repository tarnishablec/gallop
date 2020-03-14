'use strict'

import { getPropsFromFunction, shallowEqual, keyListDiff } from '../src/utils'

describe('utils', () => {
  test('getPropsFromFunction', () => {
    const testA = (
      { person } = {
        person: { name: 'yihan', call: () => alert(1) }
      }
    ) => alert(person)
    let { propsNames, defaultProp } = getPropsFromFunction(testA)
    expect(propsNames).toEqual(['person'])
    expect(defaultProp?.person.name).toBe('yihan')
  })

  test('shallowEqual', () => {
    const testA = { a: 'this is a', b: () => console.log(1), c: null }
    const testB = { a: 'this is a', b: () => console.log(1), c: null }

    const func = () => console.log(1)

    const testC = { a: 'this is a', b: func, c: null }
    const testD = { a: 'this is a ', b: func, c: null }
    const testE = { a: 'this is a', b: func, c: null }
    expect(shallowEqual(testA, testB)).toBe(false)
    expect(shallowEqual(testC, testD)).toBe(false)
    expect(shallowEqual(testC, testE)).toBe(true)
  })

  test('diff result', () => {
    const a = [2, 4, 6, 8, 7, 10]
    const b = [5, 2, 8, 6, 9, 10, 3, 7, 1]

    let res = keyListDiff(a, b)

    expect(res).toEqual({
      delete: [1],
      add: [0, 4, 6, 8],
      nochange: [5],
      move: [
        { from: 0, to: 1 },
        { from: 2, to: 3 },
        { from: 3, to: 2 },
        { from: 4, to: 7 }
      ]
    })
  })
})
