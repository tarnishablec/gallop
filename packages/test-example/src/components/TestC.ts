import {
  component,
  html,
  useEffect,
  ReactiveElement,
  useStyle,
  css
} from '@gallop/gallop'

export const TestC = component('test-c', function (
  this: ReactiveElement,
  count: number,
  color: string
) {
  useStyle(
    () => css`
      div {
        background: ${color};
      }
    `
  )

  useEffect(() => {
    console.log('test-c mounted')
    console.log(this)
  }, [])

  return html`<div>this is test-c</div>
    <div>${count}</div>`
})
