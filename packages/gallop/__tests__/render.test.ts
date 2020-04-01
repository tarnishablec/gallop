import { render, html } from '../src'

describe('render', () => {
  test('render into dom', () => {
    const container = document.createElement('div')
    const tail = document.createElement('div')
    tail.innerHTML = `<div>this is tail</div>`
    container.appendChild(tail)

    const shaClip = html`
      <div>
        <span>test render</span>
      </div>
    `

    render(shaClip, container, tail)
    expect(container.firstChild?.firstChild?.textContent).toBe('test render')

    render(shaClip)
    expect(document.body.firstChild?.firstChild?.textContent).toBe(
      'test render'
    )
  })
})
