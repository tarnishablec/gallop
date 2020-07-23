import { render, html, repeat } from '@gallop/gallop/src'

describe('repeat', () => {
  test('should not have duplicated key', () => {
    expect(() => {
      render(html`
        <div>
          ${repeat(
            [1, 1],
            (item) => item,
            (item) => item
          )}
        </div>
      `)
    }).toThrowError()
  })
})
