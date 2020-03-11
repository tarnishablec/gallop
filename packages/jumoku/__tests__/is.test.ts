'use strict'

import { isProxy } from '../src/is'
import { createProxy } from '../src/reactive'

describe('is', () => {
  test('isProxy', () => {
    const a = { a: { b: 1 } }
    let p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)
  })
})
