import { component, html, render, useState } from '@jumoku/jumoku'
import './src/components/TestB'

component('app-root', (/**/) => {
  let [state] = useState({ age: 1, color: 'red' })

  return html`
    <h1 .style="${`color:${state.color}`}">App Root</h1>
    <button @click="${() => (state.age += 1)}">age +1</button>
    <button
      @click="${() => (state.color = state.color === 'red' ? 'green' : 'red')}"
    >
      switch color
    </button>
    <test-b :name="edge" :age="${state.age}"></test-b>
    <hr />
    <hr />
    <test-b :name="${`chrome`}" :age="${state.age}"></test-b>
    <hr />
    <hr />
    <test-a></test-a>
  `
})

//-------------app root must not add props----------------//

render(html`
  <app-root></app-root>
  <style>
    body {
      background: lightgreen;
    }
  </style>
`)
