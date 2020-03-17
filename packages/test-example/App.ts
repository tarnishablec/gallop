import { component, html, render, useState } from '@jumoku/jumoku'
import './src/components/TestB'

component('app-root', () => {
  let [state] = useState({ age: 1 })

  return html`
    <h1>App Root</h1>
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
