import { generateEventOptions } from '../src/event'

describe('event', () => {
  test('generateEventOptions', () => {
    const set = new Set(['once', 'passive'])
    expect(generateEventOptions(set)).toEqual({
      once: true,
      passive: true,
      capture: false
    } as EventListenerOptions)
  })
})
