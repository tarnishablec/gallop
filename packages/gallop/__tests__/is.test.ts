import { createProxy } from '../src/reactive'
import { isProxy, isPrimitive } from '../src/is'

describe('is', () => {
  test('isProxy', () => {
    const a = { a: { b: 1 } }
    let p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)
    expect(isProxy(p.a.b)).toBe(false)
  })

  test('isPrimitive', () => {
    const a = '1'
    const b = { a }
    const c = Symbol(a)
    const d = () => alert(1)
    expect(isPrimitive(a)).toBe(true)
    expect(isPrimitive(b)).toBe(false)
    expect(isPrimitive(c)).toBe(true)
    expect(isPrimitive(d)).toBe(false)
  })
})
