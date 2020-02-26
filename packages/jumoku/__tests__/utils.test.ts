'use strict'

import { getPropsFromFunction } from '../src/utils'

describe('utils', () => {
  test('getPropsFromFunction', () => {
    const testA = (
      { person }: { person: { name: string; call: () => void } } = {
        person: { name: 'yihan', call: () => alert(1) }
      }
    ) => alert(person)
    expect(getPropsFromFunction(testA).props).toEqual(['person'])
    expect(getPropsFromFunction(testA).default?.person.name).toBe('yihan')
  })
})
