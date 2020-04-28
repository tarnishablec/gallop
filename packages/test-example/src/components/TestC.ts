import { component, html, useEffect, ReactiveElement } from '@gallop/gallop'

export const TestC = component('test-c', function (
  this: ReactiveElement,
  name: string
) {
  useEffect(() => {
    console.log('test-c mounted')
    console.log(this)
  }, [])

  return html`<div>this is test-c</div>
    <div>${name}</div>`
})
