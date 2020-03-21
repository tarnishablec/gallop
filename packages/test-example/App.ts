import { component, html, render, useState, useEffect } from '@gallop/gallop'
import './src/components/TestB'
import './src/components/TestD'

setTimeout(() => {
  import('./src/components/TestA').then(({ TestA }) => {
    TestA()
  })
}, 10000)

component('app-root', (titleFront: string, titleBack: string = 'Rooot') => {
  let [state] = useState({ age: 1, color: 'red', show: true })

  useEffect(() => {
    console.log(state.color)
  }, [state.color])

  return html`
    <h1 style="font-style:italic" .style="${`color:${state.color}`}">
      ${titleFront}&nbsp;${titleBack}
    </h1>
    <button
      @click="${() => (state.color = Math.random() > 0.5 ? 'green' : 'red')}"
    >
      switch color
    </button>
    <test-a></test-a>
    <button @click="${() => (state.show = !state.show)}">
      ${state.show ? 'destory ' : 'create '}test-b
    </button>
    ${state.show
      ? html`
          <test-b></test-b>
        `
      : null}
  `
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
