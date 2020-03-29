import { createProxy, _hasChanged } from '../src/reactive'
import { isProxy } from '../src/is'

describe('reactive', () => {
  test('hasChange', () => {
    const a = { a: { b: 1 } }
    let p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)

    p.a.b = 2
    expect(Reflect.get(p, _hasChanged)).toBe(false)
    expect(Reflect.get(p.a, _hasChanged)).toBe(true)

    p.a.b = 2
    expect(Reflect.get(p, _hasChanged)).toBe(false)
    expect(Reflect.get(p.a, _hasChanged)).toBe(false)

    p.a = { b: 3 }
    expect(Reflect.get(p, _hasChanged)).toBe(true)
    expect(Reflect.get(p.a, _hasChanged)).toBe(false)

    p.a = { b: 3 }
    expect(Reflect.get(p, _hasChanged)).toBe(false)
    expect(Reflect.get(p.a, _hasChanged)).toBe(false)

    p.a.b = 2
    expect(Reflect.get(p, _hasChanged)).toBe(false)
    expect(Reflect.get(p.a, _hasChanged)).toBe(true)
  })
})
