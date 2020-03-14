'use strict'

import { html } from '../src/parse'

describe('parse', () => {
  test('shallowClip', () => {
    const title = 'This is title'
    const color = 'red'
    const click = (e: Event) => console.log(e)

    const testHtml = html`
      <div>
        <h1 .style="${`color:${color}`}">${title}</h1>
        <button @click="${click}">Click</button>
        ${html`
          <div>child1</div>
        `}
        ${html`
          <div>child2</div>
        `}
        ${color.split('').map((c, index) =>
          index % 2
            ? html`
                <div>${c}</div>
              `
            : html`
                <span>${index}</span>
              `
        )}
      </div>
    `
    expect(testHtml.shallowParts).toEqual([
      'attr',
      'text',
      'event',
      'clip',
      'clip',
      'clips'
    ])
  })
})
