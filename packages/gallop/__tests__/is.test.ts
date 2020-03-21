'use strict'

import { isProxy, isMarker } from '../src/is'
import { createProxy } from '../src/reactive'

describe('is', () => {
  test('isProxy', () => {
    const a = { a: { b: 1 } }
    let p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)
  })

  test('isMarker', () => {
    const val = '<!--$prop${{7686168405217753}}-->'
    const val2 = '<!--$prop{{7686168405217753}}-->'
    const val3 = 'yihan'
    expect(isMarker(val)).toBe(true)
    expect(isMarker(val2)).toBe(false)
    expect(isMarker(val3)).toBe(false)
  })
})
