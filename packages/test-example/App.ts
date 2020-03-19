import { component, html, render, useState } from '@jumoku/jumoku'
import './src/components/TestB'
import './src/components/TestD'

component('app-root', (titleFront: string, titleBack: string = 'Rooot') => {
  let [state] = useState({ age: 1, color: 'red', show: true })

  return html`
    <h1 style="font-style:italic" .style="${`color:${state.color}`}">
      ${titleFront}&nbsp;${titleBack}
    </h1>
    <button
      @click="${() => (state.color = Math.random() > 0.5 ? 'green' : 'red')}"
    >
      switch color
    </button>
  `.useEffect(() => {
    console.log(state.color)
  }, [state])
})

const titleBack = 'Root'

render(html`
  <app-root :titleFront="App" :titleBack="${titleBack}"></app-root>
  <style>
    body {
      background: lightgreen;
    }
  </style>
`)
