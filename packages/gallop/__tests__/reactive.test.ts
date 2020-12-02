import { createProxy, __raw__ } from '../src/reactive'

describe('reactive', () => {
  test('normal object', () => {
    const a = { a: { b: 1 } }
    const pa = createProxy(a)
    expect(Reflect.get(pa, __raw__)).toBe(a)
    const b = { x: { y: '🏀' } }
    const pb = createProxy(b)
    expect(Reflect.get(pb.x, __raw__)).toBe(b.x)
  })

  test('createProxy of nested object', () => {
    const a = { a: { b: 1 } }
    const p = createProxy(a)
    const aa = p.a
    const aaa = p.a
    expect(aa).toBe(aaa)
  })

  test('lock object', () => {
    const a = { a: { b: 1 } }
    const p = createProxy(a, { lock: true })
    expect(() => {
      Reflect.set(p, 'c', 1)
    }).toThrowError()
  })

  test(`Map object`, () => {
    const m = new Map([[1, 2]])
    let a = 1
    const mp = createProxy(m, { onMut: () => a++ })
    mp.set(2, 3)
    expect(a).toBe(2)
    mp.delete(2)
    expect(a).toBe(3)
    mp.set(1, 2)
    expect(a).toBe(3)
    mp.clear()
    expect(a).toBe(4)
  })

  test(`WeakMap object`, () => {
    const aa = { a: 1 }
    const bb = { b: 1 }
    const m = new WeakMap<object, number>([[aa, 2]])
    let a = 1
    const mp = createProxy(m, { onMut: () => a++ })
    mp.set(bb, 3)
    expect(a).toBe(2)
    mp.delete(bb)
    expect(a).toBe(3)
    mp.set(aa, 2)
    expect(a).toBe(3)
  })

  test(`Set object`, () => {
    const m = new Set([1, 2])
    let a = 1
    const ms = createProxy(m, { onMut: () => a++ })
    ms.add(3)
    expect(a).toBe(2)
    ms.delete(3)
    expect(a).toBe(3)
    ms.add(1)
    expect(a).toBe(3)
    ms.clear()
    expect(a).toBe(4)
  })

  test(`WeakSet object`, () => {
    const aa = { a: 1 }
    const bb = { b: 1 }
    const m = new WeakSet()
    let a = 1
    const ms = createProxy(m, { onMut: () => a++ })
    ms.add(aa)
    expect(a).toBe(2)
    ms.delete(aa)
    expect(a).toBe(3)
    ms.add(bb)
    expect(a).toBe(4)
    ms.add(bb)
    expect(a).toBe(4)
  })

  test(`nested Collection`, () => {
    const aa = { a: 1 }
    const bb = { b: 1 }
    let a = 1
    const m = new Map<object, object>([[aa, bb]])
    const mp = createProxy(m, { onMut: () => a++ })
    expect(Reflect.get(mp.get(aa)!, __raw__)).toBe(bb)
    const res = mp.get(aa)!
    Reflect.set(res, 'b', 2)
    expect(a).toBe(2)
    expect(bb).toEqual({ b: 2 })
  })
})
