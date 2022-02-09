import { CustomWW } from '@gallop/woodwork'
import React, { useState } from 'react'
import { render } from 'react-dom'

const ww = new CustomWW()

console.log(ww)

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>this is react app</div>
      <div>
        <button
          onClick={() => {
            setCount((pre) => pre + 1)
          }}
        >
          add count
        </button>
        <div>{count}</div>
      </div>
    </div>
  )
}

ww.registerView('artboard', () => `this is artboard`)
ww.registerView('setting', () => `this is setting`)
ww.registerView('other', (container) => {
  render(<App />, container)
})

const layout = ww.generateLayout({
  name: 'test',
  serializedAreaTrack: {
    type: 'AreaTrack',
    direction: 'horizontal',
    children: [
      {
        type: 'Area',
        key: 'artboard'
      },
      {
        type: 'Area',
        key: 'setting'
      },
      {
        type: 'AreaTrack',
        direction: 'vertical',
        children: [
          {
            type: 'Area'
          },
          {
            type: 'Area',
            key: 'other'
          }
        ],
        grids: [1, 2]
      }
    ],
    grids: [1, 1, 2]
  }
})

ww.renderer.mount({
  rootTrack: layout.rootAreaTrack!,
  container: document.body
})

// @ts-ignore
window.layout = layout

// @ts-ignore
window.ww = ww
