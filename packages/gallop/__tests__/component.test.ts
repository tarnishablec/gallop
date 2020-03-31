import { verifyComponentName } from '../src/component'

describe('component', () => {
  test('verifyComponentName', () => {
    expect(verifyComponentName('asdasd')).toBe(false)
    expect(verifyComponentName('asdasd-0a')).toBe(true)
    expect(verifyComponentName('Adasd-asd')).toBe(false)
    expect(verifyComponentName('1')).toBe(false)
    expect(verifyComponentName('asd-sda-asdasd')).toBe(true)
  })
})
