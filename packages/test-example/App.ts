import { component, html, render, useState, useRef } from '@jumoku/jumoku'
import './src/components/TestB'

component('app-root', (titleFront: string, titleBack: string) => {
  let [state] = useState({ age: 1, color: 'red' })
  let [ref] = useRef()

  let res = html`
    <h1 style="font-style:italic" .style="${`color:${state.color}`}">
      ${titleFront}&nbsp;${titleBack}
    </h1>
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
  console.log(ref)
  return res
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
