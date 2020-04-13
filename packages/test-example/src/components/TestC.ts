import { component, html, useEffect, UpdatableElement } from '@gallop/gallop'

export const TestC = component('test-c', function (
  this: UpdatableElement,
  name: string
) {
  useEffect(() => {
    console.log('test-c mounted')
    console.log(this)
  }, [])

  return html`<div>this is test-c</div>
    <div>${name}</div>`
})
