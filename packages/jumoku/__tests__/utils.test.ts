'use strict'

import { getPropsFromFunction } from '../src/utils'

describe('utils', () => {
  test('getPropsFromFunction', () => {
    const testA = (
      { person } = {
        person: { name: 'yihan', call: () => alert(1) }
      }
    ) => alert(person)
    let { propsNames, defaultValue } = getPropsFromFunction(testA)
    expect(propsNames).toEqual(['person'])
    expect(defaultValue?.person.name).toBe('yihan')
  })
})
