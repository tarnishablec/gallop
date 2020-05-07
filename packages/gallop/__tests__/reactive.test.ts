import { createProxy, _dirty } from '../src/reactive'
import { isProxy } from '../src/is'

describe('reactive', () => {
  test('proxy', () => {
    const a = { a: { b: 1 } }
    let p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)

    p.a.b = 2
    expect(Reflect.get(p, _dirty)).toBe(undefined)
    expect(Reflect.get(p.a, _dirty)).toEqual(new Set('b'))

    p.a.b = 2
    expect(Reflect.get(p, _dirty)).toBe(undefined)
    expect(Reflect.get(p.a, _dirty)).toEqual(new Set('b'))

    p.a = { b: 3 }
    expect(Reflect.get(p, _dirty)).toEqual(new Set('a'))
    expect(Reflect.get(p.a, _dirty)).toEqual(undefined)

    p.a = { b: 3 }
    expect(Reflect.get(p, _dirty)).toEqual(new Set('a'))
    expect(Reflect.get(p.a, _dirty)).toEqual(undefined)

    p.a.b = 2
    expect(Reflect.get(p, _dirty)).toEqual(new Set('a'))
    expect(Reflect.get(p.a, _dirty)).toEqual(new Set('b'))

    const b = { x: { y: '🏀' } }
    let pb = createProxy(b, () => console.log('b changed'), undefined, true)
    expect(() => Reflect.set(pb.x, 'z', 1)).toThrowError(
      /Can not set new property to locked object/
    )
  })
  test('createProxy of nested object', () => {
    const a = { a: { b: 1 } }
    const p = createProxy(a)
    const aa = p.a
    const aaa = p.a
    expect(aa).toBe(aaa)
    expect(isProxy(aa)).toBe(true)
  })
})
