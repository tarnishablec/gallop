import { component, html, render } from '@jumoku/jumoku'
import './src/components/TestB'

component(
  'app-root',
  (/**/) => html`
    <test-b :name="${'edge'}"></test-b>
    <test-b :name="${`chrome`}"></test-b>
  `
)

//-------------app root must not add props----------------//

render(html`
  <app-root></app-root>
  <style>
    body {
      background: lightgreen;
    }
  </style>
`)
