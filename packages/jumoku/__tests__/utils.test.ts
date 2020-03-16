'use strict'

import {
  getPropsFromFunction,
  shallowEqual,
  keyListDiff,
  moveInArray
} from '../src/utils'

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
    const a = [9, 1, 2, 5, 4, 6, 8]
    const b = [7, 3, 9, 8, 5, 0, 4]

    let res = keyListDiff(a, b)
    console.log(res)

    expect(res).toEqual([
      { type: 'insert', newIndex: 0, after: null },
      { type: 'insert', newIndex: 1, after: 7 },
      { type: 'move', oldIndex: 0, after: 3 },
      { type: 'move', oldIndex: 3, after: 8 },
      { type: 'insert', newIndex: 5, after: 5 },
      { type: 'move', oldIndex: 4, after: 0 },
      { type: 'remove', oldIndex: 1 },
      { type: 'remove', oldIndex: 2 },
      { type: 'remove', oldIndex: 5 }
    ])
  })

  test('move in array', () => {
    let arr = [5, 2, 6, 8, 9, 7, 3, 10]
    moveInArray(arr, 2, 3)
    expect(arr).toEqual([5, 2, 8, 6, 9, 7, 3, 10])
    moveInArray(arr, 6, 1)
    expect(arr).toEqual([5, 3, 2, 8, 6, 9, 7, 10])
    moveInArray(arr, 0, 4)
    expect(arr).toEqual([3, 2, 8, 6, 5, 9, 7, 10])
  })
})
