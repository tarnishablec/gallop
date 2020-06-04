import { createProxy } from '../src/reactive'
import { isProxy, isIterable } from '../src/is'

describe('is', () => {
  test('isProxy', () => {
    const a = { a: { b: 1 } }
    const p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)
    expect(isProxy(p.a.b)).toBe(false)
  })

  test('isIterable', () => {
    const a = '1'
    const b = 1
    const c = new Array()
    const d = new Map()
    const e = new Set()
    const f = new WeakMap()
    const g = new WeakSet()
    const h = { a: 1, b: [] }
    expect(isIterable(a)).toBe(true)
    expect(isIterable(b)).toBe(false)
    expect(isIterable(c)).toBe(true)
    expect(isIterable(d)).toBe(true)
    expect(isIterable(e)).toBe(true)
    expect(isIterable(f)).toBe(false)
    expect(isIterable(g)).toBe(false)
    expect(isIterable(h)).toBe(false)
  })
})
