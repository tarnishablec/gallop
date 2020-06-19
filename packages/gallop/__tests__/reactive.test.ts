import { createProxy } from '../src/reactive'
import { isProxy } from '../src/is'

describe('reactive', () => {
  test('proxy', () => {
    const a = { a: { b: 1 } }
    const p = createProxy(a)
    expect(isProxy(p)).toBe(true)
    expect(isProxy(p.a)).toBe(true)
    expect(isProxy(a)).toBe(false)
    const b = { x: { y: '🏀' } }
    const pb = createProxy(b, { onSet: () => console.log('b changed') })
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
